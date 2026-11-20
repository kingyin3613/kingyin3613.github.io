// Validates conversation history sent by the browser. The history is passed to
// the API verbatim (thinking blocks must not be edited), so validation only
// accepts or rejects; it never rewrites.
import { TOOLS } from './tools.js';

const TOOL_NAMES = new Set(TOOLS.map((t) => t.name));
export const LIMITS = {
  bodyBytes: 160_000,
  messages: 60,
  questions: 12,
  questionChars: 1500,
  textChars: 20_000,
  selectionChars: 700,
  contextChars: 1600,
};

export class RequestError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const isStr = (v, max) => typeof v === 'string' && v.length <= max;

function checkAssistantBlock(b) {
  switch (b.type) {
    case 'text':
      return isStr(b.text, LIMITS.textChars);
    case 'thinking':
      return isStr(b.thinking, LIMITS.textChars) && isStr(b.signature, 40_000);
    case 'redacted_thinking':
      return isStr(b.data, 40_000);
    case 'tool_use':
      return isStr(b.id, 200) && TOOL_NAMES.has(b.name) && b.input && typeof b.input === 'object' && JSON.stringify(b.input).length < 4000;
    case 'fallback':
      return b.from && b.to && typeof b.from === 'object' && typeof b.to === 'object';
    default:
      return false;
  }
}

function checkUserBlock(b, last) {
  if (b.type === 'text') return isStr(b.text, last ? LIMITS.questionChars : LIMITS.textChars);
  if (b.type === 'tool_result' && !last) {
    if (!isStr(b.tool_use_id, 200)) return false;
    if (typeof b.content === 'string') return b.content.length <= LIMITS.textChars;
    return Array.isArray(b.content) && b.content.every((c) => c && c.type === 'text' && isStr(c.text, LIMITS.textChars));
  }
  return false;
}

export function validateAsk(body) {
  if (!body || typeof body !== 'object') throw new RequestError('bad_request', 'Expected a JSON object.');
  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) throw new RequestError('bad_request', 'messages must be a non-empty array.');
  if (messages.length > LIMITS.messages) throw new RequestError('too_long', 'This conversation is long. Start a new one to keep going.');
  let questions = 0;
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const last = i === messages.length - 1;
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) throw new RequestError('bad_request', `messages.${i}: role must be user or assistant.`);
    if (i === 0 && m.role !== 'user') throw new RequestError('bad_request', 'The first message must come from the user.');
    if (i > 0 && messages[i - 1].role === m.role) throw new RequestError('bad_request', `messages.${i}: roles must alternate.`);
    if (last && m.role !== 'user') throw new RequestError('bad_request', 'The last message must be a user question.');
    if (m.role === 'user') {
      if (typeof m.content === 'string') {
        if (!isStr(m.content, last ? LIMITS.questionChars : LIMITS.textChars) || !m.content.trim()) throw new RequestError('bad_request', `messages.${i}: invalid text.`);
        questions++;
      } else if (Array.isArray(m.content) && m.content.length && m.content.length <= 12) {
        if (!m.content.every((b) => b && checkUserBlock(b, last))) throw new RequestError('bad_request', `messages.${i}: unsupported content.`);
        if (m.content.some((b) => b.type === 'text')) questions++;
      } else {
        throw new RequestError('bad_request', `messages.${i}: invalid content.`);
      }
    } else {
      if (!Array.isArray(m.content) || m.content.length === 0 || m.content.length > 24) throw new RequestError('bad_request', `messages.${i}: invalid assistant content.`);
      if (!m.content.every((b) => b && checkAssistantBlock(b))) throw new RequestError('bad_request', `messages.${i}: unsupported assistant content.`);
    }
  }
  if (questions > LIMITS.questions) throw new RequestError('too_long', 'This conversation is long. Start a new one to keep going.');
  return messages;
}

export function validateExplain(body) {
  if (!body || typeof body !== 'object') throw new RequestError('bad_request', 'Expected a JSON object.');
  const { text, context = '', level = 'curious' } = body;
  if (!isStr(text, LIMITS.selectionChars) || text.trim().length < 2) throw new RequestError('bad_request', 'Select a shorter passage (2 to 700 characters).');
  if (!isStr(context, LIMITS.contextChars)) throw new RequestError('bad_request', 'Context too long.');
  if (!['curious', 'student', 'expert'].includes(level)) throw new RequestError('bad_request', 'level must be curious, student or expert.');
  return { text: text.trim(), context: context.trim(), level };
}
