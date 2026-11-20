// Career, projects, teaching and talks. Source: CV (January 2026) and the previous site.

export const path = [
  {
    from: 2024, to: null, years: '2024 – now',
    role: 'Research Associate',
    place: 'Department of Engineering, University of Cambridge',
    detail: 'Cambridge Solid Mechanics Group, with Vikram Deshpande.',
  },
  {
    from: 2024, to: 2024, years: '2024',
    role: 'Postdoctoral Scholar',
    place: 'Civil and Environmental Engineering, Northwestern University',
    detail: 'With Gianluca Cusatis.',
  },
  {
    from: 2018, to: 2023, years: '2018 – 2023',
    role: 'Ph.D., Civil Engineering',
    place: 'Northwestern University',
    detail: 'Thesis: Discrete Modeling of Fracture and Flow in Porous Quasi-brittle Materials by Capturing the Internal Structure. Advisor Gianluca Cusatis; committee Zdeněk Bažant, Gianluca Cusatis, Eric Landis and John Rudnicki.',
  },
  {
    from: 2016, to: 2018, years: '2016 – 2018',
    role: 'M.S., Civil Engineering',
    place: 'University of Illinois Urbana-Champaign',
    detail: 'Rail infrastructure mechanics, including a study of bolted rail joints for New York City Transit and WSP.',
  },
  {
    from: 2015, to: 2015, years: '2015',
    role: 'Structural Design Intern',
    place: 'Beijing Institute of Architectural Design',
    detail: '',
  },
  {
    from: 2012, to: 2016, years: '2012 – 2016',
    role: 'B.S., Civil Engineering',
    place: 'China Agricultural University',
    detail: 'First research on railway ballast with the discrete element method.',
  },
];

export const projects = [
  {
    title: 'Full-field measurement and property prediction of high-performance alloys via X-ray diffraction',
    sponsor: 'DARPA, U.S. Department of Defense', years: '2024 – now',
    points: [
      'In-situ, non-destructive full-field stress–strain measurement combining EDXRD and DIC.',
      'Recurrent neural operator framework that learns elastoplastic constitutive laws from noisy experimental data under realistic loading.',
      'Additively manufactured and rolled Ti-6Al-4V, Ti-6242 and Al 7075.',
    ],
  },
  {
    title: 'Graph-based learning and design of advanced mechanical metamaterials',
    sponsor: 'UKRI EPSRC, EP/X02394X/1', years: '2024 – 2025',
    points: [
      'Theory and computation of the indentation size effect of architected solids.',
      'In-situ X-ray CT and digital volume correlation of indentation tests.',
    ],
  },
  {
    title: 'Computational tools for engineered wood products under dynamic loading',
    sponsor: 'U.S. Army Engineer Research and Development Center', years: '2022 – 2024',
    points: [
      'Mixed-mode constitutive model for dynamic and strain-rate effects in wood fracture.',
      'Dynamic connector–beam lattice (dynaCBL) for engineered wood under impact.',
      'FreeCAD-based timber structural design software for impact loading.',
    ],
  },
  {
    title: 'Multiscale modelling and experimentation of mass timber',
    sponsor: 'NSF CMMI-1762757', years: '2018 – 2022',
    points: [
      'Generalized Timoshenko beam theory implemented with isogeometric analysis.',
      'The connector–beam lattice model for heterogeneous, anisotropic fracture of wood.',
      'End-to-end Python workflow for material modelling, structural analysis and post-processing.',
    ],
  },
  {
    title: 'Modified rail joint bolt-hole arrangements',
    sponsor: 'New York City Transit and WSP', years: '2017',
    points: [
      'Abaqus model of the 116RE bolted rail joint.',
      'Dynamic fatigue life with initial defects under varying train speeds, verified by strain measurements around bolt holes.',
    ],
  },
];

export const teaching = [
  { title: '3D7 Finite Element Methods', role: 'Supervisor', place: 'University of Cambridge', when: '2025' },
  { title: 'MECH_ENG 327 Finite Element Methods in Mechanics', role: 'Teaching assistant', place: 'Northwestern University', when: 'Fall 2020', pdf: '/pdf/Evaluation_MECH_ENG327_FA20.pdf' },
  { title: 'CIV_ENV 216 Mechanics of Materials I', role: 'Teaching assistant', place: 'Northwestern University', when: '2019 – 2022', pdfs: [
    { label: 'Winter 2022', href: '/pdf/Evaluation_CIV_ENV216_WI22.pdf' },
    { label: 'Spring 2021', href: '/pdf/Evaluation_CIV_ENV216_SP21.pdf' },
    { label: 'Spring 2020', href: '/pdf/Evaluation_CIV_ENV216_SP20.pdf' },
  ] },
];

export const talks = [
  { title: 'A coupling framework for multiphysics LDPM', venue: 'ASCE Engineering Mechanics Institute Conference', place: 'Chicago', when: 'May 2024', pdf: '/pdf/EMI2024_Yin_240529.pdf' },
  { title: 'The connector–beam lattice model', venue: 'ASCE Engineering Mechanics Institute Conference', place: 'Baltimore', when: 'June 2022', pdf: '/pdf/EMI2022_Yin_220601.pdf' },
  { title: 'Coupling between Abaqus solvers', venue: 'Group seminar, Northwestern University', place: 'Remote', when: 'May 2021', pdf: '/pdf/NUGroup_Yin_210510.pdf' },
  { title: 'Generalized Timoshenko beam theory', venue: 'Group seminar, Northwestern University', place: 'Evanston', when: 'October 2019', pdf: '/pdf/NUGroup_Yin_190917.pdf' },
];

export const patents = [
  { title: 'A water damage test device for asphalt concrete pavements', id: 'CN 2014207575876', year: 2015 },
  { title: 'A railway ballast cover plate', id: 'CN 2014203065268', year: 2014 },
];
