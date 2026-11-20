// Plain-language definitions. Used by the offline Lens and offline guide, and
// included in the Claude knowledge base so explanations stay consistent.

export const glossary = [
  { term: 'Discrete element method', aliases: ['DEM', 'discrete element'], text: 'A simulation method that treats a material as many separate particles that collide, rub and stick, instead of as a smooth continuum. Ideal for sand, ballast and powders.' },
  { term: 'Ballast', aliases: ['railway ballast'], text: 'The bed of crushed stone under railway sleepers. It spreads train loads, drains water and keeps the track aligned.' },
  { term: 'Voronoi tessellation', aliases: ['Voronoi', 'Voronoi cells', 'Voronoi mesh'], text: 'A way to split space into cells around seed points: every location belongs to its nearest seed. The cells look strikingly like wood cells, foams and grains.' },
  { term: 'Delaunay triangulation', aliases: ['Delaunay', 'Delaunay graph', 'Delaunay edges'], text: 'The triangulation that connects neighbouring Voronoi seeds. It is the Voronoi diagram’s dual: one describes cells, the other the paths between their centres.' },
  { term: 'Topological dual', aliases: ['dual lattice', 'topologically dual'], text: 'Two networks built on the same geometry where the cells of one correspond to the nodes of the other. Here, the solid lives on Voronoi cells and transport flows along the dual Delaunay edges.' },
  { term: 'Isogeometric analysis', aliases: ['IGA', 'isogeometric'], text: 'A finite element technique that uses the same smooth spline functions that describe CAD geometry, so curved shapes are represented exactly.' },
  { term: 'Timoshenko beam', aliases: ['Timoshenko'], text: 'A beam theory that accounts for shear deformation and rotational inertia, more accurate than the classical Euler–Bernoulli theory for short or thick beams.' },
  { term: 'Lattice discrete particle model', aliases: ['LDPM'], text: 'A mesoscale model of concrete in which aggregate particles interact through lattice connections that can crack, so fracture emerges from the material’s internal structure.' },
  { term: 'Connector–beam lattice', aliases: ['CBL', 'connector-beam lattice', 'dynaCBL'], text: 'Hao’s model of wood: curved beams represent cell walls and connector elements represent the joints between cells, which can soften and break.' },
  { term: 'Quasi-brittle', aliases: ['quasi-brittle materials'], text: 'Materials such as concrete, rock, wood and many composites that crack gradually through a zone of microcracking instead of snapping cleanly like glass.' },
  { term: 'Size effect', aliases: ['size effects'], text: 'When a structure’s strength or stiffness depends on its size, not only on its material. Large concrete beams are proportionally weaker than small ones, for example.' },
  { term: 'Indentation size effect', aliases: ['ISE'], text: 'The measured hardness or stiffness of a material changes with the size of the indent, because small indents probe only a few cells or grains.' },
  { term: 'Mass timber', aliases: ['CLT', 'cross-laminated timber', 'engineered wood'], text: 'Large structural elements made by bonding layers of wood, such as cross-laminated timber panels, used to build tall low-carbon buildings.' },
  { term: 'Inter-process communication', aliases: ['IPC'], text: 'Letting two running programs exchange data while they run. Here it couples a transport solver and a fracture solver so each sees the other’s latest results.' },
  { term: 'Hygro-thermo-mechanical', aliases: ['hygro-thermal', 'multiphysics'], text: 'Coupling moisture (hygro), heat (thermo) and deformation (mechanical): drying makes wood shrink, which can crack it, which changes how it dries.' },
  { term: 'Alkali–silica reaction', aliases: ['ASR', 'alkali-silica'], text: 'A slow chemical reaction inside concrete that forms an expansive gel and cracks the material from within.' },
  { term: 'Homogenization', aliases: ['upscaling', 'asymptotic expansion'], text: 'Mathematically replacing a detailed heterogeneous model with an equivalent smooth one that has the same average behaviour, so large structures can be simulated cheaply.' },
  { term: 'Energy-dispersive X-ray diffraction', aliases: ['EDXRD', 'X-ray diffraction', 'XRD'], text: 'Shining polychromatic X-rays through a crystal and measuring the energies that diffract. Peak positions reveal the spacing between atomic planes, so they measure strain, and therefore stress, inside the metal.' },
  { term: 'Bragg’s law', aliases: ['Bragg'], text: 'The rule that X-rays reflect strongly from atomic planes when the path difference between neighbouring planes is a whole number of wavelengths: nλ = 2d sinθ.' },
  { term: 'Debye–Scherrer rings', aliases: ['Debye rings', 'diffraction rings'], text: 'The concentric rings produced when X-rays diffract from many randomly oriented crystal grains. Under stress the rings distort into ellipses, which is how strain is read.' },
  { term: 'Digital image correlation', aliases: ['DIC', 'image correlation'], text: 'Tracking a speckle pattern on a surface across camera images to measure the full displacement and strain field, without touching the specimen.' },
  { term: 'Digital volume correlation', aliases: ['DVC'], text: 'The 3D version of image correlation: comparing X-ray CT volumes before and after loading to measure deformation inside the material.' },
  { term: 'X-ray computed tomography', aliases: ['X-ray CT', 'CT', 'tomography'], text: 'Reconstructing a 3D image of an object’s interior from many X-ray projections taken at different angles.' },
  { term: 'Architected solid', aliases: ['architected solids', 'metamaterial', 'metamaterials', 'mechanical metamaterials'], text: 'A material whose properties come from a designed internal geometry, such as a lattice of struts, rather than from its chemistry.' },
  { term: 'Constitutive law', aliases: ['constitutive model', 'constitutive models', 'material law'], text: 'The rule that links how a material is deformed (strain) to the forces inside it (stress). It is the material’s personality in a simulation.' },
  { term: 'Plasticity', aliases: ['elastoplastic', 'elastoplasticity', 'metal plasticity'], text: 'Permanent deformation: bend a paperclip far enough and it stays bent. Plastic response depends on the whole loading history, so it is a kind of memory.' },
  { term: 'Yield surface', aliases: ['yield surfaces', 'yield'], text: 'The boundary, in the space of all possible stress states, between purely elastic behaviour and the onset of plastic flow.' },
  { term: 'Hardening', aliases: ['kinematic hardening', 'isotropic hardening', 'strain hardening'], text: 'The rise in stress needed to keep deforming a metal plastically. Isotropic hardening grows the yield surface; kinematic hardening shifts it, which produces the Bauschinger effect.' },
  { term: 'Tension–compression asymmetry', aliases: ['tension-compression asymmetry'], text: 'When a material yields at a different stress in tension than in compression, common in titanium alloys because of their crystal structure.' },
  { term: 'Hysteresis', aliases: ['hysteresis loop'], text: 'When loading and unloading follow different paths, enclosing a loop. The area of the loop is energy dissipated, for instance as heat in plastic deformation.' },
  { term: 'Internal variables', aliases: ['internal variable', 'hidden variables', 'hidden internal variables'], text: 'Quantities that summarise a material’s past, such as accumulated plastic strain, so that its present state can be computed without replaying its whole history.' },
  { term: 'Recurrent neural network', aliases: ['RNN', 'GRU', 'recurrent network'], text: 'A neural network that reads a sequence step by step while keeping a hidden state, so its output can depend on everything it has seen so far.' },
  { term: 'Recurrent neural operator', aliases: ['RNO', 'neural operator', 'neural operators'], text: 'A recurrent architecture for learning material laws: it evolves a small set of learned internal variables along the loading path and maps strain plus those variables to stress, independent of the time step used.' },
  { term: 'Transfer learning', aliases: ['transfer'], text: 'Reusing what a model learned on one dataset or material to learn another faster, from less data.' },
  { term: 'Graph neural network', aliases: ['GNN', 'message passing', 'graph-based learning'], text: 'A neural network that works on graphs: each node repeatedly exchanges messages with its neighbours, which suits lattices, molecules and meshes.' },
];

// Map a phrase to glossary entries it mentions (case-insensitive, whole words).
export function findTerms(text) {
  const t = ' ' + text.toLowerCase().replace(/[^a-z0-9À-ɏ–\- ]+/g, ' ') + ' ';
  const hits = [];
  for (const g of glossary) {
    const names = [g.term, ...(g.aliases || [])];
    for (const n of names) {
      const k = n.toLowerCase();
      const re = new RegExp('(^|[^a-z0-9])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z0-9])');
      if (re.test(t)) { hits.push(g); break; }
    }
  }
  return hits;
}
