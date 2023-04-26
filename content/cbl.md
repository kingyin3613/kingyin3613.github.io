# The Connector-Beam Lattice Model for wood

Interest in engineered wood products (EWP) in construction industry is at a new high due to the low CO2 emission relative to structural properties and innovations of mass timber (e.g., gluelam, cross laminated timber). However, persistent issues stuck in front of the development of engineered wood products are the complex material behaviors of wood due to its inherent material anisotropy and heterogeneity, and consequently the reliance on extensive broad-based laboratory testing for the design and code approval of new products. To guide the laboratory testing and provide a computational tool to obtain data with high fidelity for the material properties of EWP, we propose a Connector-Beam Lattice Model for Wood (CBL-W) in 3D, which aims to naturally capture the morphological features of wood cellular micro-structure by using the connector-beam system, and to explicitly simulate the damages/cracks at the constituent material level by employing discrete-type cohesive fracture constitutive laws. The CBL-W model is a discrete-type model established on a morphologically-reproduced geometry of wood cellular structure at the microscale, and is calibrated and validated through a series of laboratory tests and mining of a vast database of wood product performance.

## Model formulation

### Isogeometric beam lattice

The detailed derivation, formulation and implementation of isogeometric beam lattice can be found [here](http://haoyin.io/paper-detail?paper=IGAbeam) or in [this paper](https://doi.org/10.1115/1.4054438).

At the meso-scale, the morphology of softwood is characterized by a cellular structure in which each cell
has a straw-like appearance. The cross section of each cell has approximately a polyhedral shape with, in the majority of
cases, 4-6 sides. The thickness of the cell wall is not constant and it tends to be larger for latewood than
earlywood. Reflecting on the cross-sectional properties of beam lattices, the number of wings, the lengths and widths of wings vary in accordance with the wood micromorphology.
The length scale of the beam lattices is 20-50 microns, depending on the wood species and the cell size earlywood, latewood. 

<p align="center">
<img src="webgl/img/beam.png"   width="85%" height="85%"/>
</p>

### Connector

Under construction!

<p align="center">
<img src="assets/cbl/longitudinal.png"   width="100%" height="100%"/>
</p>

### Computational pipeline for wood simulations
Pre-processing
Post-processing
Ghost mesh
Paraview visualization

## Numerical simulations

### Orthotropic Elasticity

Wood is often idealized as a homogeneous, orthotropic material 
in engineering practice. Based on the direction of wood grains, three principal orthogonal directions of
elasticity for wood, i.e., longitudinal (L), tangential (T) and radial (R) are determined. Within elastic regime, because of the symmetry of mutually perpendicular planes and the relationship of Poisson's ratios $\nu_{ij}/E_{i}=\nu_{ji}/E_{j}$ (no sums), twelve independent elastic constants such as three elastic
moduli, $E_L$, $E_T$, $E_R$, three transverse elastic moduli, $G_{TR}$, $G_{RL}$, $G_{LT}$, and six Poisson's ratios, $\nu_{T R}$, $\nu_{T L}$, $\nu_{R L}$, $\nu_{R T}$, $\nu_{L T}$, $\nu_{L R}$, are determined.

<p align="center">
<img src="assets/cbl/Orthotropic elasticity1.png"   width="35%" height="35%"/>
</p>

### Size effect in transverse fracture

<p align="center">
<img src="assets/cbl/global-plot-T-notched-comparsion-better.png"   width="60%" height="60%"/>
</p>

### Growth ring orientation effects in transverse fracture

<p align="center">
<img src="assets/cbl/Orientation_effect_wood1.png"   width="90%" height="90%"/>
</p>

<video src="/videos/Cube_Notched_4x4mm_a0_QM_v10_120622-abq1.webm" style="max-width:100%" controls> </video>

<video src="/videos/Cube_Notched_4x4mm_a45_QM_v10_120822-abq.webm" style="max-width:100%" controls> </video>

<video src="/videos/Cube_Notched_4x4mm_a60_QM_v10_120822-abq.webm" style="max-width:100%" controls> </video>

<video src="/videos/Cube_Notched_4x4mm_a60_QM_v10_120822-abq.webm" style="max-width:100%" controls> </video>

<video src="/videos/Cube_Notched_4x4mm_QM_v10_120322-abq1.webm" style="max-width:100%" controls> </video>

<p align="center">
<img src="assets/cbl/global-plot-T-notched-comparsion-diff-alpha.png"   width="60%" height="60%"/>
</p>

<video src="/videos/Cube_Notched_38x38mm_a0_QML_v10_012323_abq.webm" style="max-width:100%" controls> </video>

