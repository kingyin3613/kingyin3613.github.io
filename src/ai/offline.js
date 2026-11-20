// The offline guide: answers from the site's own record when the Claude
// endpoint is not configured, and performs the same choreography.
import { chapters } from '../data/chapters.js';
import { publications } from '../data/publications.js';
import { glossary } from '../data/glossary.js';
import { profile } from '../data/profile.js';

const ch = (id) => chapters.find((c) => c.id === id);

const intents = [
  { re: /\b(twelve|12|kid|child|simple|eli5|non-?expert)\b/i, reply: () => ({
    text: 'Imagine a material as a crowd of tiny pieces holding hands. **Hao** builds computer models of those crowds: stones under railways, cells inside wood, cracks, water seeping through concrete. Then he shines X-rays through metal to see how its atoms stretch, and teaches a computer to learn the rules of how the metal will bend next. Those rules depend on everything the metal has been through, so the computer has to learn a kind of **memory**.',
    actions: [{ name: 'navigate_site', view: { section: 'laws' } }],
  }) },
  { re: /(plasticit|hysteres|loop|bauschinger|harden|cyclic|yield)/i, reply: () => ({
    text: 'Here is a computed example from the site’s plasticity model. Loading a titanium-like alloy past yield, then reversing, traces a **hysteresis loop**: the metal yields again earlier on the way back (the **Bauschinger effect**, from kinematic hardening), and the loop’s area is energy turned into heat. The learning lab trains a small recurrent network to reproduce exactly this kind of path-dependent behaviour from noisy data.',
    actions: [{ name: 'run_plasticity_experiment', view: { path: 'cyclic', amplitude: 3, cycles: 2 } }, { name: 'navigate_site', view: { section: 'lab' } }],
  }) },
  { re: /(neural|operator|\brno\b|machine learning|\bml\b|\bai\b|learn|network|data-driven)/i, reply: () => ({
    text: ch('laws').summary + '\n\nA **recurrent neural operator** keeps a few hidden internal variables that evolve along the loading path, playing the role that back stress and accumulated plastic strain play in classical plasticity, and maps strain plus those variables to stress.',
    actions: [{ name: 'navigate_site', view: { section: 'laws' } }, { name: 'show_publications', view: { ids: ['xray-plasticity-2026'] } }],
  }) },
  { re: /(x-?ray|diffract|edxrd|\bdic\b|image correlation|measure|synchrotron|strain gauge)/i, reply: () => ({ text: ch('light').summary + '\n\nEnergy-dispersive diffraction reads the spacing of crystal planes from the energies of diffracted X-rays; under stress that spacing changes, so the peaks shift and the Debye–Scherrer rings stretch into ellipses.', actions: [{ name: 'navigate_site', view: { section: 'light' } }] }) },
  { re: /(crack|fractur|break|quasi-?brittle|size effect|impact)/i, reply: () => ({ text: ch('fracture').summary, actions: [{ name: 'navigate_site', view: { section: 'fracture' } }] }) },
  { re: /(wood|timber|ringspy|cell|voronoi|beam|isogeometric|\biga\b|clt)/i, reply: () => ({ text: ch('cells').summary, actions: [{ name: 'navigate_site', view: { section: 'cells' } }, { name: 'show_publications', view: { ids: ['ringspy-2023', 'iga-beam-2022'] } }] }) },
  { re: /(flow|moisture|transport|multiphysic|coupl|freeze|thaw|alkali|asr|diffusion|hygro)/i, reply: () => ({ text: ch('flow').summary, actions: [{ name: 'navigate_site', view: { section: 'flow' } }, { name: 'show_publications', view: { ids: ['flm-2023', 'ipc-coupling-2024'] } }] }) },
  { re: /(architect|metamaterial|indent|truss|graph)/i, reply: () => ({ text: ch('architecture').summary, actions: [{ name: 'navigate_site', view: { section: 'architecture' } }, { name: 'show_publications', view: { ids: ['size-effects-2026'] } }] }) },
  { re: /(ballast|rail|stone|grain|\bdem\b|discrete element|sleeper)/i, reply: () => ({ text: ch('stones').summary, actions: [{ name: 'navigate_site', view: { section: 'stones' } }] }) },
  { re: /(paper|read first|publication|recommend|cite|article)/i, reply: () => ({
    text: 'Three good entry points: the **X-ray plasticity preprint** for the machine-learning work, **RingsPy** for the open-source cellular geometry, and the **inter-process communication coupling** paper for multiphysics fracture. The full list is in the publication index.',
    actions: [{ name: 'show_publications', view: { ids: ['xray-plasticity-2026', 'ringspy-2023', 'ipc-coupling-2024'] } }],
  }) },
  { re: /(career|\bcv\b|education|phd|ph\.d|degree|teach|course|background|cambridge|northwestern)/i, reply: () => ({ text: profile.summary, actions: [{ name: 'navigate_site', view: { section: 'path' } }] }) },
  { re: /(contact|email|reach|collaborat|hire|job)/i, reply: () => ({ text: `You can write to Hao at **${profile.emailUser}@${profile.emailDomain}**. Links to Google Scholar, GitHub and the CV are in the contact section.`, actions: [{ name: 'navigate_site', view: { section: 'contact' } }] }) },
];

export function offlineAnswer(question) {
  const q = question.toLowerCase();
  const term = glossary.find((g) => [g.term, ...(g.aliases || [])].some((n) => q.includes(n.toLowerCase())) && /\b(what|explain|define|mean|is)\b/.test(q));
  if (term) {
    const hit = intents.find((i) => i.re.test(question));
    return { text: `**${term.term}.** ${term.text}`, actions: hit ? hit.reply().actions.filter((a) => a.name === 'navigate_site') : [] };
  }
  for (const it of intents) if (it.re.test(question)) return it.reply();
  return {
    text: 'This is the site’s offline guide, so it can only answer from the page itself. Try asking about the **neural operator**, **X-ray measurement**, **how wood cracks**, the **learning lab**, or **which paper to read first**. When the site’s Claude endpoint is connected, any question about the research gets a full answer.',
    actions: [],
  };
}

export const glossaryFor = (text) => {
  const t = text.toLowerCase();
  return glossary.filter((g) => [g.term, ...(g.aliases || [])].some((n) => t.includes(n.toLowerCase()))).slice(0, 3);
};

export const pubById = (id) => publications.find((p) => p.id === id);
