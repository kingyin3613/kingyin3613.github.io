// Tools the guide can call. They run here in the worker; the browser watches
// the event stream and choreographs the page to match.
import { sections, chapters } from '../../src/data/chapters.js';
import { publications } from '../../src/data/publications.js';
import { experiment, PATH_TYPES } from '../../src/lab/plasticity.js';
import { SECTION_IDS, PUBLICATION_IDS } from './knowledge.js';

const sectionInfo = (id) => {
  const c = chapters.find((x) => x.id === id);
  if (c) return { title: c.title, years: c.era, summary: c.summary, on_screen: c.scene };
  const s = sections.find((x) => x.id === id);
  const extra = {
    top: 'The opening: a live mass-spring wood lattice the visitor can indent with the cursor.',
    lab: 'The learning lab: a recurrent network training in the browser on a plasticity model.',
    publications: 'The full publication index, filterable by theme.',
    path: 'Career steps, funded projects, teaching, talks and patents, drawn as growth rings.',
    contact: 'Email and links.',
  };
  return { title: s?.title || id, summary: extra[id] || '' };
};

export const TOOLS = [
  {
    name: 'navigate_site',
    description:
      'Scroll the visitor\'s page to a section so the animated lattice shows that topic. Call this once, before writing your answer, whenever the answer is mainly about one section: stones (railway ballast, discrete elements), cells (wood, beams), ringspy (the RingsPy software: figures, install commands, links), fracture, flow (multiphysics, transport), light (X-ray diffraction and image correlation), architecture (architected solids, indentation size effects), laws (neural operators, learning constitutive laws), lab (the in-browser learning lab), publications, path (career, teaching, talks) or contact. Returns the section summary.',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: {
        section: { type: 'string', enum: SECTION_IDS, description: 'Section id to show.' },
      },
      required: ['section'],
      additionalProperties: false,
    },
  },
  {
    name: 'show_publications',
    description:
      'Show specific papers to the visitor as linked cards and highlight them in the publication index. Call this whenever you recommend, cite or discuss particular publications, using ids from the record. Returns their full metadata.',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string', enum: PUBLICATION_IDS },
          description: 'One to five publication ids, most relevant first.',
        },
      },
      required: ['ids'],
      additionalProperties: false,
    },
  },
  {
    name: 'run_plasticity_experiment',
    description:
      'Run the site\'s 1D elastoplasticity model (return mapping with Armstrong-Frederick kinematic and Voce isotropic hardening, titanium-like parameters; the same ground truth the learning lab uses) on a strain path. The visitor sees the stress-strain plot. Call this when a computed example would help explain plasticity, hysteresis loops, hardening, the Bauschinger effect or the learning lab. Returns summary numbers and a coarse sample of the curve.',
    eager_input_streaming: true,
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', enum: PATH_TYPES, description: 'monotonic loading, symmetric cyclic loading, cycles of growing amplitude, or a random history.' },
        amplitude: { type: 'number', description: 'Peak strain in multiples of the yield strain, between 0.5 and 5.' },
        cycles: { type: 'integer', description: 'Number of cycles, between 1 and 5 (ignored for monotonic).' },
      },
      required: ['path', 'amplitude', 'cycles'],
      additionalProperties: false,
    },
  },
];

export class ToolInputError extends Error {}

function validate(name, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new ToolInputError('input must be an object');
  if (name === 'navigate_site') {
    if (!SECTION_IDS.includes(input.section)) throw new ToolInputError(`section must be one of ${SECTION_IDS.join(', ')}`);
    return { section: input.section };
  }
  if (name === 'show_publications') {
    if (!Array.isArray(input.ids) || input.ids.length === 0) throw new ToolInputError('ids must be a non-empty array');
    const ids = [...new Set(input.ids)].filter((id) => PUBLICATION_IDS.includes(id)).slice(0, 5);
    if (!ids.length) throw new ToolInputError('no valid publication ids');
    return { ids };
  }
  if (name === 'run_plasticity_experiment') {
    if (!PATH_TYPES.includes(input.path)) throw new ToolInputError(`path must be one of ${PATH_TYPES.join(', ')}`);
    const amplitude = Number(input.amplitude);
    const cycles = Math.round(Number(input.cycles));
    if (!Number.isFinite(amplitude) || amplitude < 0.5 || amplitude > 5) throw new ToolInputError('amplitude must be between 0.5 and 5');
    if (!Number.isFinite(cycles) || cycles < 1 || cycles > 5) throw new ToolInputError('cycles must be between 1 and 5');
    return { path: input.path, amplitude, cycles };
  }
  throw new ToolInputError(`unknown tool ${name}`);
}

// Returns { forModel, view } or throws ToolInputError.
export function runTool(name, rawInput) {
  const input = validate(name, rawInput);
  if (name === 'navigate_site') {
    return { input, forModel: { ok: true, section: input.section, ...sectionInfo(input.section) }, view: { section: input.section } };
  }
  if (name === 'show_publications') {
    const list = input.ids.map((id) => publications.find((p) => p.id === id));
    return {
      input,
      forModel: { ok: true, publications: list.map((p) => ({ id: p.id, title: p.title, authors: p.authors, venue: p.venue, year: p.year ?? 'in preparation', link: p.href, summary: p.summary })) },
      view: { ids: input.ids },
    };
  }
  const r = experiment(input.path, input.amplitude, input.cycles);
  return { input, forModel: r, view: { path: input.path, amplitude: input.amplitude, cycles: input.cycles } };
}
