// Open-source software shown on the site. The page renders the RingsPy card
// from this object, and the Claude guide and the offline guide read it too.

export const ringspy = {
  id: 'ringspy',
  name: 'RingsPy',
  version: 'v2.2.0',
  tagline: 'Wood cells, grown ring by ring, in Python.',
  lede:
    'RingsPy is my open-source generator of cellular solids. It places cell seeds ring by ring around a pith, tessellates them into Voronoi cells with thin earlywood and thick latewood walls, clips the cross-section to any outline and extrudes it into a 3D mesh, ready for ParaView, a 3D printer or an Abaqus simulation.',
  features: [
    'Softwoods and hardwoods: vessels (ring-porous or diffuse-porous) and rays',
    'Elliptical, eccentric and wavy growth rings, a tapered stem and spiral grain',
    'Any outline, from a polygon or an SVG or DXF drawing',
    'Reconstruction of the cells from a CT scan of a real specimen',
    'Batch generation, cell statistics and graph export for machine learning',
  ],
  install: [
    { label: 'pip', cmd: 'pip install "ringspy[all]"' },
    { label: 'conda', cmd: 'conda install -c conda-forge ringspy' },
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/kingyin3613/ringspy' },
    { label: 'PyPI', href: 'https://pypi.org/project/ringspy/' },
    { label: 'conda-forge', href: 'https://anaconda.org/conda-forge/ringspy' },
    { label: 'JOSS paper', href: 'https://doi.org/10.21105/joss.04945' },
  ],
  video: {
    mp4: '/img/ringspy/ringspy-hero.mp4',
    poster: '/img/ringspy/ringspy-hero-poster.webp',
    alt: 'RingsPy at work: rays, vessels and fiber cells placed ring by ring around an eccentric pith, a Voronoi tessellation with thick latewood walls, clipping to a dog-bone, a star, a polygon and a hexagon, and extrusion with a taper, a twist and a spiral grain into a 3D cellular mesh.',
  },
  figures: [
    {
      src: '/img/ringspy/ringspy-2d.webp',
      full: '/img/ringspy/ringspy-2d-full.webp',
      width: 972,
      height: 744,
      light: true,
      alt: 'Previews of four generated cross-sections: a softwood cube coloured by growth ring, a ring-porous hardwood with vessels and rays, an eccentric reaction-wood section, and a honeycomb clipped by a hexagon.',
      caption: '2D previews: softwood, ring-porous hardwood, reaction wood, honeycomb',
    },
    {
      src: '/img/ringspy/ringspy-3d.webp',
      width: 1818,
      height: 508,
      alt: 'Three 3D meshes rendered in ParaView: a wood cube coloured by connector width, a hardwood with vessels and rays, and a tapered, spiral-grained specimen coloured by growth ring.',
      caption: '3D meshes in ParaView: wood cube, hardwood, spiral grain',
    },
    {
      src: '/img/ringspy/ringspy-ct.webp',
      width: 1600,
      height: 738,
      alt: 'Reconstruction from a CT scan: the cell corners and walls found in a cross-section, and the cells followed through the volume.',
      caption: 'Cells reconstructed from a CT scan',
    },
  ],
  summary:
    'RingsPy (open source, GPL-3.0, published in JOSS 2023; current version v2.2.0) is Hao Yin\'s Python package for Voronoi-based generation of 3D meshes of prismatic cellular solids with radial growth rules, such as wood. It places cell seeds ring by ring, tessellates them with thin earlywood and thick latewood walls, clips the cross-section to a square, triangle, hexagon, polygon or an SVG/DXF outline, and extrudes it into a 3D mesh exported for ParaView (VTU), 3D printing (STL) and Abaqus. v2.2.0 adds hardwood vessels (ring-porous or diffuse-porous) and rays, elliptical, eccentric and wavy rings, stem taper and spiral grain, cell statistics, and a quick 2D preview; v2.1 added reconstruction of the cell lattice from CT scans, and v2.0 added a command-line interface (ringspy run, ringspy batch) and graph export of the cell mesh (PyTorch Geometric layout) for machine learning. Install with pip install "ringspy[all]" or conda install -c conda-forge ringspy. Source: https://github.com/kingyin3613/ringspy, PyPI: https://pypi.org/project/ringspy/, conda-forge: https://anaconda.org/conda-forge/ringspy.',
};
