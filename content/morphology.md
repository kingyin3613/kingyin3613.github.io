# Voronoi tessellation-based mesh generator for the mesoscale structure of prismatic cellular materials

This project contains both mechanical and hygro-thermal models of wood specimens and engineering wood composites (e.g. Cross Laminated Timber, CLT) at both macroscale (structural) and mesoscale (wood cells) level.

<img src="assets/ringspy/woodmultiscale.png"   width="100%" height="100%"/>

The lattice mesh generator for the microstructure of timber has been developed. The plane section mesh is featured by its Voronoi tessellation-based plane partition algorithm, each polygon in the plane mesh can be seen as a cell and the boundaries can be seen as the cell walls of the wood. The radius of the timber section, the annual ring width, the earlywood and latewood distribution, and the representative cell size are taken into consideration in lattice mesh generation, while the longitudinal extrusion algorithm is characterized by the microfibril angle, the longitudinal fiber length, and the segment length distribution. The clipping box technique is implemented to cut the 3D wood lattice mesh into any desired shape of the specimen. The small element removal technique is also developed in order to speed up the explicit analyses of the lattice model, by taking out elements with critical time steps smaller than the threshold.

<img src="assets/10.gif"   width="40%" height="40%"/>

## Near bolt-hole cracking of rail joint
A rail joint is a component used in railway tracks to connect two pieces of rails end to end. Since rail tracks need to cover long distances, the rails used in tracks are typically made of sections or lengths, rather than a continuous piece. Rail joints are used to connect these sections of rails together, creating a continuous track that can carry trains.

Rail joints are typically made of steel and consist of two pieces: a male end and a female end. The male end is typically a smaller piece of rail that has a raised edge on one side, while the female end is a larger piece of rail with a groove that the male end fits into. When the two pieces of rail are placed together, they form a secure connection that can withstand the weight and force of passing trains.

Proper installation and maintenance of rail joints is important for the safe and efficient operation of railway tracks. In some cases, defects in rail joints can lead to derailments or other accidents, so regular inspection and repair of rail joints is crucial for maintaining safe rail transport. (Credit to ChatGPT for this amazing description!)

<img src="assets/rail/joint.jpg"   width="90%" height="90%"/>

Fatigue is a major issue with rail joints that can result in highly hazardous circumstances. Rail joints are subject to repeated stress as trains pass over them, which can cause fatigue and ultimately lead to cracking or failure of the joint. 
Fatigue crackings can happen as illustrated in pictures below: bolt-hole cracking (left), and upper fillet cracking (head-web separation).

<img src="assets/rail/photo.png"   width="90%" height="90%"/>

## Dynamic finite element model
A finite element model of rail joint system was developed to simulate the dynamic response of the rail joint system to the impact load caused by moving wheels. The 115RE rail and standard joint bars were selected to represent a typical joint used in rail transit systems in the United States.
The total length of each rail was 216 in. (548.6 cm), based on the sensitivity analysis of rail length in our earlier research, the length of each rail modeled with 3-D deformable solid elements set to 36 in. (91.4 cm), and the remaining 180 in. (457.2 cm) of each rail was simplified by assigning rail section properties to linear beam elements. 
The crossties were modeled with vertical spring and dashpot systems.
The initial height mismatch between the sending rail and receiving rail was also introduced in this dynamic FE model to better simulate the geometric imperfections at the rail joints caused by poor assembly, ground settlement, etc.
Below is a schematic diagram of the FE model of bolted rail joint. 

<img src="assets/rail/Model.png"   width="80%" height="80%"/>

For the geometry of wheel, the diameter of wheel was set to R = 17 in. (43.2 cm), which was a typical size of railcar wheel used in heavy rail transit systems, such as the MTA New York City Transit Authority. Due to the fact that the behavior of rail joint system was primarily studied in the vertical plane and the models were loaded vertically and symmetrically in the longitudinal direction of the rail, the railcar wheel was modeled as a cylinder without a flange.
Figure below shows the components of FE model generated in the simulation.

<img src="assets/rail/Assembly.png"   width="50%" height="50%"/>


Contact interactions between components were formulated using surface-to-surface contact discretization, and a master-slave surface pair was defined for each contact pair. This contact formulation method prevents large and undetected penetrations from nodes on the master surface into slave surface, providing more accurate stress and strain results compared with other methods. The basic Coulomb friction model with the penalty friction formulation was used to simulate the frictional force response at the contact interface. The maximum allowable frictional stress is related to contact pressure by the coefficient of friction (COF) between contacting bodies.


All the parts (i.e., wheel, rail, rail joint) were assumed to behave elastically in the dynamic FE analysis and a correction of long-term behavior of materials was performed in conjunction with the fatigue life analysis. The supporting system (e.g. crosstie, ballast, etc.) was represented in the model by linear spring and dashpot elements. The equivalent springs and dampers were ones contributed from the crosstie, rail pad, ballast, subgrade, etc.

Examplar simulation results at train speed of 20 mph (32.1 km/h) are shown in video and figure below. In the figure, from top to bottom: (a) wheel-rail contact patch (b) Von Mises stress around rail-end bolt hole (c) Von Mises stress at rail-end upper fillet (d) vertical displacement at rail-end.


<video src="/videos/extrusion.webm" style="max-width:100%" controls> </video>

Below is the contact force history of wheel-rail interface of bolted rail joint at train speed of 20 mph (32.1 km/h).

<img src="assets/rail/rail3.png"   width="70%" height="70%"/>

Based on a test report provided by NYCTA, the ultimate tensile strength (UTS) of the steel used for 115RE rail was approximately 177.0 ksi (1,220 MPa), strength at 107 cycles (Fatigue Limit) was 61.5 ksi (424 MPa), which were two key parameters used for the fatigue life analysis. The fatigue limit represents a cyclic stress amplitude below which the material does not fail and could be cycled indefinitely (i.e., an infinite fatigue life). For ductile steel specifically, the fatigue limit is the strength of the material at 107 cycles of loading. In other words, if the steel structural system could experience at least 107 cycles of loading without cracking or other damage, it is assumed that no fatigue damage would occur under the same loading conditions. 

The Brown-Miller criterion was selected for this specific fatigue analysis, which gave the most realistic fatigue life estimates for ductile metals. The Brown-Miller equation suggests that the maximum fatigue damage occurs on the plane which experiences the maximum shear strain amplitude, and that damage is a function of both this shear strain amplitude (Δγmax/2) and the normal strain amplitude (Δεn/2).  Accordingly, different from the conventional strain-life equation (Equation 2), the Brown-Miller equation (Equation 3) alters the left-hand side of the equation with the addition of shear strain amplitude and normal strain amplitude.

$$
\frac{\Delta \varepsilon}{2}=\frac{\sigma_f^{\prime}}{E}\left(2 N_f\right)^b+\varepsilon_f^{\prime}\left(2 N_f\right)^c
$$

$$
\frac{\Delta \gamma_{\max }}{2}+\frac{\Delta \varepsilon_n}{2}=C_1 \frac{\sigma_f^{\prime}}{E}\left(2 N_f\right)^b+C_2 \varepsilon_f^{\prime}\left(2 N_f\right)^c
$$

Generally, it can be observed that for mean stress, a tensile mean stress has a detrimental effect on endurance cycles N_f, whereas a compressive mean stress has a beneficial effect. For stress amplitude, the endurance cycles N_f increases as the applied stress amplitude σ_a decreases. To correct the influence of mean stress, the Morrow mean stress correction was adopted for Brown-Miller criterion. After the application of Morrow mean stress correction, the Brown-Miller equation (Equation 3) becomes Equation 6, with a corrected elastic term by subtracting the mean normal stress on the plane, σ_(n,m).

Prevailing rail industry knowledge would state that the contact force generally decreases monotonically decreasing train speed, but findings shown in figure below from this study are not in agreement with the literature. The concept that dynamic load increases with the traveling speed increases in the literature is based on the well-established vehicle-track interaction theory without considering the joints. However, there are two important differences between this study and existing literature: 1) the gap between the two rails, and 2) the differential displacement of the two rails at the joint. Due to the gap between the two rails, the sending rail and the receiving rail will not have the same displacement at the same time. When the wheel is approaching the end of the sending rail, the displacement of the end of the sending rail increases. The displacement of the sending rail will cause the joint bar to move together. The displacement of the joint bar will then cause the displacement of the receiving rail. The sending rail will reach its maximum displacement when the wheel is on top of the end of the rail, right before the wheel rolls over the gap. However, the receiving rail will not reach the same displacement simultaneously. The differential displacement of the two rails will cause additional height mismatch before the wheel hit the receiving rail. Previous research has shown the maximum contact force when the wheel hits the receiving rail increases as a function of height mismatch. Due to the rail height mismatch at the joint and the relationship of the operation speed and the rail mismatch discussed above, the maximum contact force may not decrease monotonically with the operation speed decreases. 

<img src="assets/rail/rail7.png"   width="80%" height="80%"/>


If you find this work useful, or if it helps you in your research on rail joints, we kindly ask that you cite this paper:
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