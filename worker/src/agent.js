// The guide's agent loop. Each round streams one Messages API response; tool
// calls are executed here and fed back until Claude answers in text.
import Anthropic from '@anthropic-ai/sdk';
import { GUIDE_SYSTEM, EXPLAIN_SYSTEM } from './knowledge.js';
import { TOOLS, runTool, ToolInputError } from './tools.js';

const BETAS = ['server-side-fallback-2026-07-01', 'thinking-binding-controls-2026-08-01'];
const SYSTEM_BLOCKS = [{ type: 'text', text: GUIDE_SYSTEM, cache_control: { type: 'ephemeral' } }];
const EXPLAIN_BLOCKS = [{ type: 'text', text: EXPLAIN_SYSTEM, cache_control: { type: 'ephemeral' } }];
const LEVEL_NOTE = { curious: 'Level: curious.', student: 'Level: student.', expert: 'Level: expert.' };

// After a mid-output fallback, thinking and tool_use blocks before the last
// fallback boundary must not be echoed; everything else is kept in place.
export function echoable(content) {
  let last = -1;
  content.forEach((b, i) => { if (b.type === 'fallback') last = i; });
  if (last < 0) return content;
  return content.filter((b, i) => i >= last || !['thinking', 'redacted_thinking', 'tool_use', 'server_tool_use'].includes(b.type));
}

function addUsage(total, u) {
  if (!u) return;
  for (const k of ['input_tokens', 'output_tokens', 'cache_read_input_tokens', 'cache_creation_input_tokens']) total[k] += u[k] || 0;
}

export async function runGuide({ client, model, effort, messages, emit, signal, userId, maxRounds = 4, maxTokens = 4096 }) {
  const appended = [];
  const usage = { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
  let stop = null;
  let retries = 0;
  let servedBy = model;
  for (let round = 0; round < maxRounds; round++) {
    const params = {
      model,
      max_tokens: maxTokens,
      betas: BETAS,
      fallbacks: 'default',
      thinking: { type: 'adaptive', block_binding: { prefix_mismatch_behavior: 'drop_block' } },
      output_config: { effort },
      cache_control: { type: 'ephemeral' },
      system: SYSTEM_BLOCKS,
      tools: TOOLS,
      messages: [...messages, ...appended],
    };
    if (round === maxRounds - 1) params.tool_choice = { type: 'none' };
    if (userId) params.metadata = { user_id: userId };
    let message;
    let textBlocks = 0;
    try {
      const stream = client.beta.messages.stream(params, { signal });
      for await (const ev of stream) {
        if (ev.type === 'message_start' && ev.message?.model) servedBy = ev.message.model;
        else if (ev.type === 'content_block_start') {
          const b = ev.content_block;
          if (b.type === 'text') { if (textBlocks++ > 0 || appended.length) emit({ t: 'block' }); }
          else if (b.type === 'tool_use') emit({ t: 'tool_call', id: b.id, name: b.name });
          else if (b.type === 'fallback') emit({ t: 'fallback' });
        } else if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') {
          emit({ t: 'text', d: ev.delta.text });
        }
      }
      message = await stream.finalMessage();
    } catch (err) {
      if (err instanceof Anthropic.APIError || signal?.aborted) throw err;
      // unparseable streamed tool input or a dropped connection: re-issue once
      if (retries++ < 1) { round--; continue; }
      throw err;
    }
    retries = 0;
    addUsage(usage, message.usage);
    if (message.stop_reason === 'refusal') { stop = 'refusal'; break; }
    let content = echoable(message.content);
    const toolUses = content.filter((b) => b.type === 'tool_use');
    if (message.stop_reason !== 'tool_use' || toolUses.length === 0) {
      // never store a tool call that will not get a result (e.g. cut off at max_tokens)
      if (toolUses.length) content = content.filter((b) => b.type !== 'tool_use');
      if (content.length) appended.push({ role: 'assistant', content });
      stop = message.stop_reason;
      break;
    }
    appended.push({ role: 'assistant', content });
    const results = [];
    for (const tu of toolUses) {
      try {
        const r = runTool(tu.name, tu.input);
        emit({ t: 'tool', id: tu.id, name: tu.name, view: r.view });
        results.push({ type: 'tool_result', tool_use_id: tu.id, content: JSON.stringify(r.forModel) });
      } catch (e) {
        const msg = e instanceof ToolInputError ? e.message : 'tool failed';
        emit({ t: 'tool_error', id: tu.id, name: tu.name });
        results.push({ type: 'tool_result', tool_use_id: tu.id, is_error: true, content: JSON.stringify({ error: msg, received: tu.input }) });
      }
    }
    appended.push({ role: 'user', content: results });
  }
  // A dangling tool round (user tool_result last) cannot be followed by a new
  // user question, so close it with a short assistant turn.
  if (appended.length && appended[appended.length - 1].role === 'user') {
    appended.push({ role: 'assistant', content: [{ type: 'text', text: '(The guide ran out of steps for this question.)' }] });
    if (!stop) stop = 'max_rounds';
  }
  emit({ t: 'turn', messages: appended });
  emit({ t: 'done', stop, model: servedBy, usage });
}

export async function runExplain({ client, model, effort, input, emit, signal, userId }) {
  const content = `${LEVEL_NOTE[input.level]}\n\n<context>\n${input.context || '(none)'}\n</context>\n\n<passage>\n${input.text}\n</passage>`;
  const params = {
    model,
    max_tokens: 2048,
    betas: BETAS.slice(0, 1),
    fallbacks: 'default',
    output_config: { effort },
    system: EXPLAIN_BLOCKS,
    messages: [{ role: 'user', content }],
  };
  if (userId) params.metadata = { user_id: userId };
  const stream = client.beta.messages.stream(params, { signal });
  for await (const ev of stream) {
    if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') emit({ t: 'text', d: ev.delta.text });
  }
  const message = await stream.finalMessage();
  emit({ t: 'done', stop: message.stop_reason, usage: message.usage });
}
