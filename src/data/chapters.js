// The narrative. Each chapter drives one state of the lattice engine and one
// section of the page. `summary` and `scene` are written for the Claude guide.

export const chapters = [
  {
    id: 'stones',
    title: 'Stones',
    era: '2014 – 2018',
    state: 'grains',
    accent: '#d4c0a1',
    tint: '#141210',
    lede: 'It began beneath the railway, with stones nobody looks at.',
    paras: [
      'Ballast is a granular memory: every passing train rearranges it a little. As an undergraduate in Beijing I simulated it grain by grain with the discrete element method — direct shear tests, sleepers pushed through stone beds, the chance that a single grain takes flight beneath a high-speed train.',
      'At Illinois the stones gave way to steel. For New York City Transit I followed fatigue in bolted rail joints, from finite element models to strain measurements around the bolt holes. The lesson stayed with me: what a material does lives in how it is arranged.',
    ],
    notes: [
      { text: 'Discrete element models of ballast in direct shear', ref: 'dem-shear-2015' },
      { text: 'Train speed and the fatigue life of bolted rail joints', ref: 'rail-joint-2018' },
      { text: 'Two Chinese patents: a ballast cover plate and an asphalt water-damage tester' },
    ],
    summary:
      'Undergraduate (China Agricultural University, 2012–2016) and M.S. (UIUC, 2016–2018) work on railway infrastructure: discrete element modelling of ballast (direct shear tests, single-tie push tests, ballast flight risk) and a 2017 study for New York City Transit and WSP on bolt-hole arrangements in 116RE bolted rail joints, with dynamic fatigue analysis under varying train speeds verified by strain measurements around bolt holes under cyclic loading.',
    scene: 'The lattice falls apart into angular ballast stones that settle into a heap under a sleeper.',
  },
  {
    id: 'cells',
    title: 'Cells',
    era: '2018 – 2023',
    state: 'cells',
    accent: '#e8ab62',
    tint: '#16110b',
    lede: 'Wood writes its history in rings.',
    paras: [
      'At Northwestern, working with Gianluca Cusatis, I wanted models that see what wood sees: cells, walls and the seasons that built them. RingsPy grows Voronoi cell structures ring by ring. A generalized theory of curved and twisted Timoshenko beams, implemented with isogeometric analysis, turns every cell wall into a beam.',
      'The connector–beam lattice joins them into one material. Beams carry the cell walls, connectors carry the joints between them, and the model runs inside Abaqus at more than ten million elements, resolving features of ten to a hundred microns in specimens tens of centimetres long.',
    ],
    notes: [
      { text: 'RingsPy, open-source growth of cellular solids', ref: 'ringspy-2023' },
      { text: 'Curved and twisted Timoshenko beams with isogeometric analysis', ref: 'iga-beam-2022' },
      { text: 'NSF CMMI-1762757: multiscale modelling and experiments on mass timber' },
    ],
    summary:
      'PhD work at Northwestern University (2018–2023, advisor Gianluca Cusatis) under NSF CMMI-1762757. RingsPy (JOSS 2023, open source, now v2.2.0 on PyPI and conda-forge) generates Voronoi meshes of cellular solids with radial growth patterns, including hardwood vessels and rays, eccentric and spiral-grained stems, arbitrary outlines and reconstruction from CT scans; the page shows it in a RingsPy card just after this chapter. A generalized formulation for geometrically curved and twisted 3D Timoshenko beams with isogeometric analysis (J. Appl. Mech. 2022) represents cell walls with irregular cruciform cross-sections. The connector–beam lattice (CBL) model for wood combines these beams with nonlinear connector elements (smeared-crack and cohesive laws), implemented as Abaqus UEL/VUEL subroutines for implicit and explicit analysis, optimized for more than 10 million elements with element sizes of 10–100 microns. Validated with experiments by collaborators at the University of Maine on orthotropic elasticity and growth-ring-oriented fracture. He also built an end-to-end Python workflow for material modelling, structural analysis and post-processing of timber.',
    scene: 'A cross-section of wood: Voronoi cells growing in annual rings, earlywood and latewood.',
  },
  {
    id: 'fracture',
    title: 'Fracture',
    era: '2019 – 2024',
    state: 'crack',
    accent: '#ff6c3f',
    tint: '#170d0a',
    lede: 'Breaking is information.',
    paras: [
      'Concrete, wood and composites are quasi-brittle: they fail through a slow negotiation between microcracks. In a lattice every connector can soften and break, so cracks find their own path. Size effects emerge without being asked for, and the angle of the growth rings steers fracture just as experiments at the University of Maine showed.',
      'For the U.S. Army Engineer Research and Development Center I carried this to impact: a mixed-mode, rate-dependent law for wood fracture, a dynamic connector–beam lattice, and a FreeCAD-based tool that lets engineers design timber for impact loads.',
    ],
    notes: [
      { text: 'Connector–beam lattice model for wood', ref: 'cbl-prep' },
      { text: 'Load-induced thermal strain of concrete at high temperature', ref: 'ldpm-thermal-2022' },
      { text: 'Thesis: discrete modelling of fracture and flow in porous quasi-brittle materials', ref: 'thesis-2023' },
    ],
    summary:
      'Fracture of quasi-brittle materials (concrete, wood, composites) with lattice/discrete models: CBL simulations reproduce size effects in transverse fracture and growth-ring-orientation effects in wood; lattice discrete particle model (LDPM) work on concrete, including load-induced thermal strain at high temperature (Int. J. Mech. Sci. 2022). For the U.S. Army ERDC (2022–2024) he formulated a mixed-mode constitutive model for dynamic and strain-rate effects in wood fracture, developed a dynamic connector–beam lattice (dynaCBL) for engineered wood products under impact, and built a FreeCAD-based timber design tool for impact loading. PhD thesis (2023): Discrete Modeling of Fracture and Flow in Porous Quasi-brittle Materials by Capturing the Internal Structure; committee Zdeněk Bažant, Gianluca Cusatis, Eric Landis and John Rudnicki.',
    scene: 'A radial drying check runs through the wood lattice; connectors glow and break at the crack tip as it opens.',
  },
  {
    id: 'flow',
    title: 'Flow',
    era: '2020 – now',
    state: 'flow',
    accent: '#53d8ca',
    tint: '#08130f',
    lede: 'Matter breathes.',
    paras: [
      'Water, heat and ions travel through the same pores that cracks open. I built the Flow Lattice Model on the topological dual of the mechanical lattice — Voronoi cells for the solid, Delaunay edges for transport — so that both physics live on one geometry.',
      'Then I made the solvers talk. Through inter-process communication, implicit and explicit solvers exchange fields while the simulation runs: a crack draws moisture in, and moisture drives the next crack. The same lattice language now reaches freeze–thaw damage and alkali–silica reaction in concrete.',
    ],
    notes: [
      { text: 'Flow Lattice Model for chemistry-dependent transport', ref: 'flm-2023' },
      { text: 'Two-way coupling through inter-process communication', ref: 'ipc-coupling-2024' },
      { text: 'Freeze–thaw cracking and alkali–silica reaction', ref: 'freeze-thaw-2027' },
    ],
    summary:
      'Multiphysics of porous materials on topologically dual lattices: the Flow Lattice Model (Eur. J. Environ. Civ. Eng. 2023) for chemistry-dependent transport in cementitious materials; asymptotic homogenization of discrete diffusion models (2022); a two-way coupling approach based on inter-process communication for implicit–explicit multiphysics LDPM simulations (Eng. Fract. Mech. 2024); hygro-thermo-mechanical modelling of wood and concrete, including orthotropic hygroscopic behaviour of mass timber (Mater. Struct. 2023), freeze–thaw cycles (CMAME 2027) and alkali–silica reaction upscaling (Cem. Concr. Res. 2026).',
    scene: 'The dual Delaunay lattice lights up inside the wood; moisture pulses travel along it, drawn in through the open crack.',
  },
  {
    id: 'light',
    title: 'Light',
    era: '2024 – now',
    state: 'light',
    accent: '#8db8ff',
    tint: '#0a0e18',
    lede: 'To learn a law, you first have to see it.',
    paras: [
      'Models are only as honest as the measurements that test them. Working with Vikram Deshpande in the Cambridge Solid Mechanics Group, I measure stress inside metals without cutting them open. Energy-dispersive X-ray diffraction reads the spacing between crystal planes — a strain gauge built into the atoms — while digital image correlation follows the surface.',
      'Together they turn one specimen into thousands of stress–strain histories, in situ and non-destructively, for titanium alloys made by 3D printing and by rolling, for Ti-6242 and for Al 7075. The same eye for interfaces now reaches solid-state batteries, where deposits of impurities cost electrodes their contact.',
    ],
    notes: [
      { text: 'Full-field EDXRD + DIC measurement, funded by DARPA' },
      { text: 'Democratising lab-based X-ray diffraction', ref: 'edxrd-prep' },
      { text: 'Contact loss in all-solid-state Li-ion batteries', ref: 'joule-2026' },
    ],
    summary:
      'At Cambridge (since July 2024) on a DARPA-funded project, Hao developed an in-situ, non-destructive full-field stress–strain measurement framework combining energy-dispersive X-ray diffraction (EDXRD) with digital image correlation (DIC), and characterised additively manufactured Ti-6Al-4V, rolled Ti-6Al-4V, Ti-6242 and Al 7075. Related: democratising lab-based EDXRD (in preparation) and contact loss in all-solid-state Li-ion batteries via deposition of impurities (Joule 2026).',
    scene: 'The lattice becomes Debye–Scherrer diffraction rings of titanium; as strain grows the rings stretch into ellipses and the energy spectrum shifts.',
  },
  {
    id: 'architecture',
    title: 'Architecture',
    era: '2024 – 2025',
    state: 'arch',
    accent: '#cdb6ff',
    tint: '#110d18',
    lede: 'Some materials are made of geometry.',
    paras: [
      'Architected solids take their properties from topology rather than chemistry, and at small scales they stop obeying continuum theory: under an indenter their response depends on size. We analysed these indentation size effects across families of architected solids, and watched lattices deform strut by strut with in-situ X-ray tomography and digital volume correlation.',
      'A lattice is also a graph — nodes, edges, messages passed between neighbours — which is exactly the language modern machine learning speaks. That is where this story was heading all along.',
    ],
    notes: [
      { text: 'Mechanisms of size effects in elastic architected solids', ref: 'size-effects-2026' },
      { text: 'In-situ X-ray CT and digital volume correlation of indentation' },
      { text: 'EPSRC EP/X02394X/1: graph-based learning and design of mechanical metamaterials' },
    ],
    summary:
      'EPSRC project EP/X02394X/1 (graph-based learning and design of advanced mechanical metamaterials, 2024–2025): theoretical and computational analyses of the indentation size effect of various architected solids, and in-situ X-ray CT with digital volume correlation (DVC) of indentation tests. Related paper: Mechanisms of size effects in elastic architected solids (Acta Materialia 2026).',
    scene: 'A triangulated truss lattice is indented from above; struts colour by strain and messages ripple outward like a graph neural network.',
  },
  {
    id: 'laws',
    title: 'Laws',
    era: '2024 – now',
    state: 'laws',
    accent: '#ffd27c',
    tint: '#14110a',
    lede: 'Teaching machines the memory of matter.',
    paras: [
      'Plasticity is memory: what a metal does next depends on everything it has already been through. Classical models store that memory in internal variables someone had to invent. A recurrent neural operator learns them instead — hidden variables that carry the loading history forward, discovered from data.',
      'Trained on laboratory X-ray diffraction and image-correlation measurements, our mechanics-constrained operator reconstructs complex yield surfaces, with tension–compression asymmetry and multiaxial hardening, from a single geometrically complex specimen — inside a pipeline that links experiments, data generation and transfer learning.',
    ],
    notes: [
      { text: 'Learning metal plasticity constitutive models via laboratory-based X-ray measurements', ref: 'xray-plasticity-2026' },
      { text: 'Recurrent neural operators for elastoplasticity from noisy data' },
      { text: 'Ti-6Al-4V, Ti-6242 and Al 7075, funded by DARPA' },
    ],
    summary:
      'Scientific machine learning for constitutive modelling: a recurrent neural operator (RNO) framework that learns elastoplastic constitutive laws from noisy experimental data under realistic loading. Preprint (MechanicsArXiv, posted August 2026): Learning metal plasticity constitutive models via laboratory-based X-ray measurements — a lab-scale platform combining EDXRD with optical DIC measures local multiaxial stress–strain responses from a single geometrically complex specimen, and the data train a mechanics-constrained neural operator that reconstructs complex yield surfaces including tension–compression asymmetry and multiaxial strain hardening, framed as a scalable pipeline linking experimentation, data generation and transfer learning.',
    scene: 'The lattice becomes an unrolled recurrent network whose hidden state carries memory through time, above a stress–strain hysteresis loop fitted through noisy data.',
  },
  {
    id: 'ask',
    title: 'Ask',
    era: 'Live',
    state: 'ask',
    accent: '#ffe2a8',
    tint: '#0d0c10',
    lede: 'This site has a voice.',
    paras: [
      'Ask about any paper, method or idea here and a Claude model answers from my research record — and moves the lattice to show you. Select any sentence on the page and it will be explained at your level.',
    ],
    notes: [],
    summary: 'The AI guide itself: a Claude model with tools that move this page.',
    scene: 'A slowly turning constellation that pulses while the guide is thinking.',
  },
];

export const chapterIds = chapters.map((c) => c.id);

// Extra navigation targets that are not narrative chapters.
export const sections = [
  { id: 'top', title: 'Beginning' },
  ...chapters.flatMap((c) => (c.id === 'cells' ? [{ id: c.id, title: c.title }, { id: 'ringspy', title: 'RingsPy' }] : [{ id: c.id, title: c.title }])),
  { id: 'lab', title: 'Learning lab' },
  { id: 'publications', title: 'Publications' },
  { id: 'path', title: 'Path' },
  { id: 'contact', title: 'Contact' },
];
