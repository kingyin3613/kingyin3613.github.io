# Voronoi tessellation-based mesh generator for the mesoscale structure of wood

Wood has a unique micromorphology featuring a local pattern of prismatic cells and a global pattern of annual growth rings. Understanding the role of locally irregular and globally radial micromorphology in determining material properties offers a new path to unveil the behavior of wood and wood-based materials with functionalities, such as anisotropic material properties, stress redirection, and oriented impact energy dissipation. 
While laboratory and in-situ imaging approaches are reliable for the reconstruction of high-resolution wood micromorphologies in computational modeling, algorithm-based generation of wood microstructure geometries are still in high demand. They have the advantage of lowering cost while enabling rapid prototyping and stochastic analysis of wood products during the design phase. This study develops a rapid wood micromorphology modeling technique, based on Voronoi tessellation and Lloyd's relaxation algorithm, to mimic the prismatic cellular microstructure for softwood in 3D. The generated wood microstructure is then integrated with the Connector-Beam Lattice Model for wood (CBL-W) to establish a pipeline for numerical simulations of the quasi-static and fracture properties of wood and wood-based materials.

<img src="assets/ringspy/1a71c89aaa01bc48024753d2e207c281.jpg"   width="90%" height="90%"/>

## Multiscale structure of wood

Wood and engineered wood composites are biological composite materials that are made up of several hierarchical levels of organization. They have different structures at different levels of scale, from the macroscopic to the microscopic.

<p align="center">
<img src="assets/ringspy/woodmultiscale.png"   width="100%" height="100%"/>
</p>

At the macroscopic level, wood has a complex structure of annual growth rings, which are formed as a result of variations in the rate of growth of the tree over the course of a year. The growth rings are composed of concentric layers of wood, each with its own distinct properties, such as density, porosity, and strength.

At the mesoscopic level, wood has a cellular structure that consists of longitudinal cells called tracheids and fibers, which are responsible for the mechanical strength and flexibility of the material. These cells are arranged in layers in the longitudinal direction, which give wood its characteristic grain pattern.

<p align="center">
<img src="assets/ringspy/41578_2020_195_Figa_HTML.png"   width="60%" height="60%"/>
</p>

At the microscopic level, wood is composed of cellulose fibers that are arranged in a helical pattern, surrounded by a matrix of lignin and other compounds. The arrangement of these fibers gives wood its unique mechanical properties, including high stiffness and strength, as well as the ability to withstand bending and compression.

In this project, we focus on the <b>mesoscale</b> structure of wood, at which the solid constituents (i.e., tracheids and fibers) exhibit the "intrinsic heterogeneity and anisotropy" of the material at the µm level.

## Voronoi tessellation for wood mesostructure

The cellular mesostructure of wood is a natural outcome of local cell growth that follows simple intrinsic physical rules, among these, Voronoi diagram [(click here for more details)](https://en.wikipedia.org/wiki/Voronoi_diagram), has been proposed to be one of the simple but accurate approximations of cell interfaces at the steady-state by the equilibrium of intracellular pressures and the intercellular surface tension in a plane. This Voronoi diagram is also suitable for representing sections of other cellular materials, such as trabecular bone, skeletal muscle fiber and some 3D printed biomimetic composites.

To generate a 2D Voronoi diagram for wood section, we firstly pick a set of input points (a.k.a., seeds), which will determine the Voronoi cells and follows rules such as the wood cell density distribution. Then for each input point, we determine the set of points that are closest to it. These points form the boundary of the Voronoi cell for that input point. We then connect adjacent Voronoi cells to form the edges of the diagram, these edges represent wood cell walls. In some cases, the Voronoi cells may extend infinitely far in one or more direction, these infinite cells combined with the finite cells on the boundary lines of the model are truncated and trimed.

<img src="assets/ringspy/voronoi.png"   width="100%" height="100%"/>

Apart from the basic Voronoi diagram, another technique is adopted to achieve a more realistic wood cellular structure: Lloyd's relaxation, also known as Lloyd's algorithm or Voronoi iteration, is a computational method for finding an optimal set of points that minimize the distance between the points and a given set of data. The algorithm iteratively partitions the data space into cells by computing Voronoi diagrams and then moves the points to the centroid of each cell. This process is repeated until convergence, which means that the point set no longer changes significantly. By using Lloyd's relaxation with appropriate boundary conditions, we can simulate the radial growth process of wood cells. One example of the simulation of softwood growth is as shown in figure below:

<p align="center">
<img src="assets/10.gif"   width="40%" height="40%"/>
</p>

The formation of the annual growth rings follows density models of annual rings. We firstly employ a truncated normal distribution for the annual ring widths, then within each annual ring, the variability of wood cell density is considered via the transition from early wood (larger cell size but smaller cellwall thickness) to late wood (smaller cell size but larger cellwall thickness).

<img src="assets/ringspy/growth_rule_binary.png"   width="90%" height="90%"/>

The 2D Voronoi diagram is then rotated and extruded in the longitudinal (out-of-plane) direction, to form the straw-like shapes of wood tracheids or fibers. The extrusion in the longitudinal direction can be cut into many layers, the segments have various lengths which are dependent on the wood species. The rotation angle of wood tracheids or fibers during the extrusion represents the natural inclination during tree growth. The video below illustrates the whole process of longitudinal extrusion, and boundary formation:

<video src="/videos/extrusion.webm" style="max-width:100%" controls> </video>

## RingsPy package for wood micromorphology modeling

RingsPy ([https://github.com/kingyin3613/ringspy](https://github.com/kingyin3613/ringspy)) is our open-source package entirely written in Python that generates 3D meshes of prismatic cellular solids with tunable radial growth rules featured by many natural or architectured cellular solids with a radial, differential cell growth pattern. The 2D geometry of the cellular structure of the solid is first constructed with a 2D Voronoi tessellation, 
and then the 2D Voronoi cells are extruded in the longitudinal (parallel-to-grain) direction with a certain grain angle around the longitudinal axis. This process is supposed to mimic the morphology and dynamic growth of natural or additively manufactured cellular materials. 

<img src="assets/ringspy/ModelVisualization.png"   width="100%" height="100%"/>

The package is dependent only on `numpy` and `scipy` for core implementation, however, regular cells (e.g., hexagonal honeycomb structure) option is also provided, with the help of Python package `hexalattice`. The visualization of the generated geometry is implemented using Python package `matplotlib` for 2D cross-sectional images, and for 3D models using the VTK or STL format files (which can be then used in scientific visualization tools such as Paraview and for 3D printing).

<p align="center">
<img src="assets/ringspy/Model2DPreview.png"   width="80%" height="80%"/>
</p>


<p align="center">
<img src="assets/ringspy/comparison.png"   width="80%" height="80%"/>
</p>


If you take use of this package, or if it helps you in your research on cellular solids, we kindly ask that you cite this paper:
[![DOI](https://joss.theoj.org/papers/10.21105/joss.04945/status.svg)](https://doi.org/10.21105/joss.04945)

```
@article{ringspy,
    doi = {10.21105/joss.04945},
    url = {https://doi.org/10.21105/joss.04945},
    year = {2023},
    publisher = {The Open Journal},
    volume = {8},
    number = {83},
    pages = {4945},
    author = {Hao Yin and Gianluca Cusatis},
    title = {RingsPy: A Python package for Voronoi mesh generation of cellular solids with radial growth pattern},
    journal = {Journal of Open Source Software}
}
```