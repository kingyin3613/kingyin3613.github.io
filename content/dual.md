# Topologically dual systems of lattice models

Lattice models of solids have been motivated, in large part, by the discontinuous and heterogeneous nature of material structure and its breakdown under external loading. These models have been extensively developed over the past few decades, enabling researchers to study the material structure-property relationships in new and innovative ways. Furthermore, lattice models are now being extended to include additional physical, chemical, or biological processes to ensure the material's durability and sustainability under rapidly changing environmental conditions.

Discretization of the material domain plays a crucial role in the representation of mechanical or transport behaviors in the presence of large-scale material heterogeneity. 
Among the various discretization techniques, the most promising method is one that naturally captures the intrinsic geometric properties of material internal structure (e.g., heterogeneity, anisotropy) while also possessing a topologically dual geometric system. This approach can be particularly powerful for analyzing the interplay between mechanical and transport behaviors of the material.

## Voronoi Delaunay duality

Voronoi Delaunay duality is a fundamental concept in computational geometry that relates two types of geometric structures: Voronoi diagrams and Delaunay triangulations.

A Voronoi diagram is a partitioning of a plane into regions based on the distance to a set of points. Specifically, given a set of points in the plane, the Voronoi diagram of those points is a collection of polygons, each of which corresponds to the region of points that are closer to a particular input point than to any other input point.

A Delaunay triangulation, on the other hand, is a triangulation of a set of points such that no point is inside the circumcircle of any triangle in the triangulation. In other words, the Delaunay triangulation is a way to connect the input points with edges such that the resulting triangles are "as large and as equilateral as possible".

<p align="center">
<img src="assets/dual/dual.png"   width="80%" height="80%"/>
</p>

<p align = "center">
<small>
<span style="color:grey">
Image credit: Wolfram MathWorld
</span>
</small>
</p>

The Voronoi Delaunay duality is the observation that there is a one-to-one correspondence between the Voronoi diagram of a set of points and the Delaunay triangulation of the same set of points. Specifically, the vertices of the Voronoi diagram correspond to the circumcenters of the triangles in the Delaunay triangulation, and the edges of the Voronoi diagram correspond to the edges of the Delaunay triangulation. This duality has many important applications in computational geometry and computer graphics, such as in mesh generation, proximity queries, and geometric optimization.

 This duality is specifically important to the lattice models: because for many lattice models, for the purposes of getting unbiased spatial discretization or capturing the intrinsic heterogeneous structure of the material, they incline to use Voronoi and/or Delaunay diagrams as the geometric characterization approach; if one geometric structure aforementioned is used for spatial discretization, the duality provides a naturally coupled spatial discretization for the void/different phase of material in the same model domain. This will facilitate the multi-field analysis with strong coupling between different phases.
 
<p align="center">
<img src="assets/dual/duality.png_large"   width="70%" height="70%"/>
</p>

<p align = "center">
<small>
<span style="color:grey">
Image Credit： Twitter@FreyaHolmer
</span>
</small>
</p>


## Dual mesh for multiscale analysis of wood (or other prismatic cellular materials)

A example of using Voronoi Delaunay duality for the geometrical characterization is the multiscale multiphysics analysis of wood. As introduced in the 
The Voronoi ridges (cell walls) of is shown as the solid line. The representitive transport network that is connecting all nodes for transport fields is shown as the dashed lines in figure below.

Under construction!

<p align="center">
<img src="assets/dual/40571_2022_473_Fig1_HTML.png"   width="35%" height="35%"/>
</p>


## Dual mesh for multiscale analysis of concrete

Another usage of topologically dual lattice systems is for the multiscale multiphysics analysis of concrete. Originally proposed by Cusatis et al. in 2011, the `Lattice Particle Discrete Model (LDPM)` cell system, which provides a geometrical characterization for mechanical behaviors of concrete. The dual part is referred to as the `Flow Lattice Model (FLM)` network which provides the geometrical characterization of the flow (transport) behaviors of concrete. 


To capture the granular nature of the concrete internal mesostructure, `LDPM` tessellates the model domain with randomly packed polyhedral cells, which represent the volumes of cementitious fine mortar surrounding coarse aggregate particles. The cell size corresponds to the length scale at which the significant material heterogeneities (coarse aggregates fields) are observed. 
Idealized spherical particles that approximate the aggregate particles of concrete are packed in the polyhedral cells with no overlapping to the cell boundaries. The particle size distribution curve follows a Fuller sieve curve to reproduce realistic concrete mesostructures. The surfaces of the polyhedral cells consist of so-called `LDPM` tetrahedra/facets, which define the potential failure locations in comparatively weak mortar. The left part in figure below briefly illustrates the construction of `LDPM` "particle-facet-cell" system.

With the tessellated domain, a flow network can be formed by connecting the tet points belonging to each pair of two adjacent LDPM tetrahedra with 1D line transport elements, the resulting network is shown in figure below.

<p align="center">
<img src="assets/dual/LDPM1.png"   width="100%" height="100%"/>
</p>

Related work of dual lattices can be found in this paper:

```
@article{doi:10.1080/19648189.2023.2242456,
author = {Hao Yin and Antonio Cibelli and Susan-Alexis Brown and Lifu Yang and Lei Shen and Mohammed Alnaggar and Gianluca Cusatis and Giovanni Di Luzio},
title = {Flow Lattice Model for the simulation of chemistry dependent transport phenomena in cementitious materials},
journal = {European Journal of Environmental and Civil Engineering},
volume = {0},
number = {0},
pages = {1-25},
year  = {2023},
publisher = {Taylor & Francis},
doi = {10.1080/19648189.2023.2242456},
URL = {https://doi.org/10.1080/19648189.2023.2242456}
}
```