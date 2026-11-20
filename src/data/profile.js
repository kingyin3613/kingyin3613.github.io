// Single source of truth for who Hao is. Imported by the page build
// (vite.config.js), the browser bundle, and the Claude worker's knowledge base.

export const profile = {
  name: 'Hao Yin',
  nameNative: '银皓',
  role: 'Research Associate',
  group: 'Cambridge Solid Mechanics Group',
  department: 'Department of Engineering',
  org: 'University of Cambridge',
  collaborator: 'Vikram Deshpande',
  emailUser: 'hy423',
  emailDomain: 'cam.ac.uk',
  links: {
    scholar: 'https://scholar.google.com/citations?user=pB-bgC4AAAAJ&hl=en',
    github: 'https://github.com/kingyin3613',
    linkedin: 'https://www.linkedin.com/in/hao-yin-a86a95166/',
    ringspy: 'https://github.com/kingyin3613/ringspy',
    cv: '/pdf/HaoYin-CV-01012026.pdf',
  },
  hero: {
    title: 'Materials remember.',
    sub: 'I’m Hao Yin, a computational mechanician at the University of Cambridge. I model how matter bends, breaks and breathes — and teach machines to learn its laws from light.',
    hint: 'Press and drag across the lattice. It is a live mass–spring network.',
  },
  summary:
    'Hao Yin is a Research Associate in the Cambridge Solid Mechanics Group (Department of Engineering, University of Cambridge), working with Prof. Vikram Deshpande. His research joins lattice and discrete models of fracture and multiphysics, in-situ full-field measurement (energy-dispersive X-ray diffraction, digital image correlation, X-ray CT with digital volume correlation) and scientific machine learning, notably recurrent neural operators that learn elastoplastic constitutive laws from laboratory X-ray data. He received his Ph.D. in Civil Engineering from Northwestern University (advisor Gianluca Cusatis), an M.S. from the University of Illinois Urbana-Champaign and a B.S. from China Agricultural University.',
  tools: [
    'Python, PyTorch, C++, Fortran, MATLAB, JavaScript',
    'Abaqus user elements (UEL/VUEL), MOOSE, COMSOL, FreeCAD, Rhino',
    'Energy-dispersive X-ray diffraction, digital image correlation, X-ray CT and DVC, MTS testing, 3D printing',
  ],
};

export function email() {
  return `${profile.emailUser}@${profile.emailDomain}`;
}
