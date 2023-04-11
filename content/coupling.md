# Two-way coupling framework for Multiphysics-LDPM

Previously proposed for Multiphysics-LDPM (M-LDPM), the Flow Lattice Model (FLM) has proved its capability of capturing the mass transport and heat transfer with a discrete-type dual mesh of LDPM. Now coupled with LDPM, the multiphysics problems such as the thermal-hydro-mechanical problem can be solved in a two-way coupled FLM-LDPM analysis framework with the help of the Interprocess Communication (IPC). The periodic data communication between two Abaqus solvers (Abaqus/standard for the thermal/diffusion part and Abaqus/Explicit for the mechanical part) and spatial & temporal mappings between the two solvers allow the coupling process to run smoothly and robustly. 

## Importance of 

After crack formation, however, the conduit elements are highly skew to the crack path, which (in a conceptual sense)
follows the boundaries of the discrete bodies. This misalignment of the flow elements with the crack path does not allow
for realistic simulations of crack-assisted flow and its dependence on crack opening.
By defining the flow network on the particle boundaries (e.g., on the edges of the Voronoi tessellation or generally on the
dual grid), both pre-cracking and postcracking flow can be simulated. The cross-section areas of the flow elements
scale according to the corresponding facets of the Delaunay tetrahedra, enabling precise simulations of uniform flow through the
uncracked material. Furthermore, flow elements are now aligned with potential cracks. The mechanical
analysis provides values of crack opening, which govern the properties of the flow elements along the crack path.
This one-way coupling between fracture analyses and crack-assisted transport is relevant to a variety of durability problems of
mechanical concrete, since most of the deterioration mechanisms are affected by the presence and transport of water or chemical
species in solution. Such analysis is difficult in homogeneous continuum models as the information about
crack connectivity and opening is not directly available. Using this dual network complex, two-way couplings between fluid pressure
and evolving crack networks enable simulations of hydraulic driven fracture in concrete and other geomaterials.
Whereas these representations of post-cracking flow or flow-driven fracture are realistic, this dual-lattice approach introduces
several complicating factors.

• In three dimensions, the dual lattice defined by the edges of the tessellation is computationally more expensive than its
Delaunay counterpart. The numbers of dual lattice vertices and flow lattice elements are dramatically greater than those of
the Delaunay vertices and mechanical lattice elements, respectively.

• Coupling of the displacement and flow fields is complicated by the use of different nodal sets for each respective field.

• The occurrence of essentially zero-length conduit elements can ill-condition the system of equations associated with the
flow field analyses. Such zero-length edges rarely occur from the random placement of mechanical nodes, but some regular
arrangements of nodes lead to degenerate Delaunay tessellations and zero-length Voronoi edges. The problem can be mitigated
by assigning a sufficiently large length to the elements in question.


In summary, crack development introduces new pathways for mass transport, which can be readily handled by discrete
approaches, albeit with increased computational cost. In contrast, continuum approaches may require remeshing to accommodate
crack development and the associated new pathways for mass transport. This is complicated for various reasons, including difficulties
in simulating the transition from diffused to localized cracking, the need to transfer history-dependent internal variables onto the
new mesh configurations and occurrence of crack-induced flow anisotropy.

## Inter-process communication

Learn how to fetch your content with `$content`: https://content.nuxtjs.org/fetching.

## Coupling schemes

As noted, discrete models can represent one- or two-way couplings involving the network structure and field quantities of interest.
Several forms of coupling exist. Simultaneous coupling of the field quantities can be introduced within the theoretical formulations
(using, e.g., the effective stress concept of Biot). Alternatively a sequential procedure can be used, where one set of field quantities is
calculated separately, assuming the other field quantities are in a steady-state condition. In many cases, results of the potential field
analyses feed forward into the mechanical analyses [41,205]. Iterative solutions can account for interplay between the differing
field variables within each computational cycle, which may better account for the path dependent, irreversible nature of crack
propagation [215]. Coupled hydro-mechanical processes are central to several geoscience applications, where many advancements
in modeling have been made [216]. 

<img src="assets/8.png"   width="50%" height="50%"/>
