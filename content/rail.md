# Investigation of relationship between train speed and bolted rail joint fatigue life using finite element analysis

Reducing the allowable operating speed or imposing temporary speed restrictions are common practices to prevent further damage to rail track when defects are detected related to certain track components. However, the speeds chosen for restricted operation are typically based on past experience without considering the magnitude of the impact load around the rail joints. Due to the discontinuity of geometry and track stiffness at the bolted rail joints, an impact load always exists. Thus, slower speeds may not necessarily reduce the stresses at the critical locations around the rail joint area to a safe level. Previously, the relationship between speed and the impact load around the rail joints has not been thoroughly investigated. 

Recent research performed at the University of Illinois at Urbana-Champaign (UIUC) has focused on investigating the rail response to load at the joint area. A finite element model (FEM) with the capability of simulating a moving wheel load has been developed to better understand the stress propagation at the joint area under different loading scenarios and track structures. This study investigated the relationship between train speed and impact load and corresponding stress propagation around the rail joints to better understand the effectiveness of speed restrictions for bolted joint track. 

Preliminary results from this study indicate that the contact force at the wheel–rail interface would not change monotonically with the changing train speed. In other words, when train speed is reduced, the maximum contact force at the wheel–rail interface may not necessarily reduce commensurately.

&nbsp;<br>

*Our work on the homepage of UIUC CEE website! See below:*

<img src="assets/rail/lookatthisonuiucceewebsite.png"   width="80%" height="80%"/>

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

Examples of the simulation results at train speed of 20 mph (32.1 km/h), from top to bottom: (a) wheel-rail contact patch (b) Von Mises stress around rail-end bolt hole (c) Von Mises stress at rail-end upper fillet (d) vertical displacement at rail-end.

<img src="assets/rail/rail1.png"   width="100%" height="100%"/>

<img src="assets/rail/rail2.png"   width="100%" height="100%"/>

Below is the contact force history of wheel-rail interface of bolted rail joint at train speed of 20 mph (32.1 km/h).

<img src="assets/rail/rail3.png"   width="70%" height="70%"/>

Based on a test report provided by NYCTA, the ultimate tensile strength (UTS) of the steel used for 115RE rail was approximately 177.0 ksi (1,220 MPa), strength at 107 cycles (Fatigue Limit) was 61.5 ksi (424 MPa), which were two key parameters used for the fatigue life analysis. The fatigue limit represents a cyclic stress amplitude below which the material does not fail and could be cycled indefinitely (i.e. an infinite fatigue life). For ductile steel specifically, the fatigue limit is the strength of the material at 107 cycles of loading. In other words, if the steel structural system could experience at least 107 cycles of loading without cracking or other damage, it is assumed that no fatigue damage would occur under the same loading conditions (16). 

Fatigue Analysis Algorithms
The Brown-Miller criterion was selected for this specific fatigue analysis, which gave the most realistic fatigue life estimates for ductile metals. The Brown-Miller equation suggests that the maximum fatigue damage occurs on the plane which experiences the maximum shear strain amplitude, and that damage is a function of both this shear strain amplitude (Δγmax/2) and the normal strain amplitude (Δεn/2).  Accordingly, different from the conventional strain-life equation (Equation 2), the Brown-Miller equation (Equation 3) alters the left-hand side of the equation with the addition of shear strain amplitude and normal strain amplitude (17).

Mean Stress Corrections
Typically, it is common for a load history to have a non-zero mean stress, σ_m, which is defined in Equation 4. The fatigue performance would vary as the mean stress changes. The influence of mean stress can be characterized as the influence of stress amplitude, σ_a, the distance of minimum stress to maximum stress in a fatigue loading cycle (Equation 5).  

Generally, it can be observed that for mean stress, a tensile mean stress has a detrimental effect on endurance cycles N_f, whereas a compressive mean stress has a beneficial effect. For stress amplitude, the endurance cycles N_f increases as the applied stress amplitude σ_a decreases (19). To correct the influence of mean stress, the Morrow mean stress correction was adopted for Brown-Miller criterion. After the application of Morrow mean stress correction, the Brown-Miller equation (Equation 3) becomes Equation 6, with a corrected elastic term by subtracting the mean normal stress on the plane, σ_(n,m) (20).

<img src="assets/rail/rail7.png"   width="80%" height="80%"/>

<img src="assets/rail/fatiguelife.png"   width="65%" height="65%"/>

Prevailing rail industry knowledge would state that the contact force generally decreases monotonically decreasing train speed (21), but findings shown in Figure 7 from this study are not in agreement with the literature. The concept that dynamic load increases with the traveling speed increases in the literature is based on the well-established vehicle-track interaction theory without considering the joints. However, there are two important differences between this study and existing literature: 1) the gap between the two rails and 2) the differential displacement of the two rails at the joint. Due to the gap between the two rails, the sending rail and the receiving rail will not have the same displacement at the same time. When the wheel is approaching the end of the sending rail, the displacement of the end of the sending rail increases. The displacement of the sending rail will cause the joint bar to move together. The displacement of the joint bar will then cause the displacement of the receiving rail. The sending rail will reach its maximum displacement when the wheel is on top of the end of the rail (8), right before the wheel rolls over the gap. However, the receiving rail will not reach the same displacement simultaneously. The differential displacement of the two rails will cause additional height mismatch (h_w) before the wheel hit the receiving rail (Figure 8). Previous research has shown the maximum contact force when the wheel hits the receiving rail increases as a function of height mismatch (10). Figure 9 shows the height mismatch increased when the speed decreased. Figure 8 and 9, when combined, show that when the operation speed reduced, the rail height mismatch would increase, and as a result, the maximum contact force could increase. Due to the rail height mismatch at the joint and the relationship of the operation speed and the rail mismatch discussed above, the maximum contact force may not decrease monotonically with the operation speed decreases, as illustrated again in Figure 10. 

<img src="assets/rail/rail8.png"   width="75%" height="75%"/>

<p align="center">
      <img src="assets/rail/rail8.png" width="50%" height="50%" align="left">
      <img src="assets/rail/rail9.png" width="50%" height="50%">
</p>


## Lab measurements of near bolt-hole strain fields

<img src="assets/rail/rail4.png"   width="80%" height="80%"/>

<img src="assets/rail/rail5.png"   width="75%" height="75%"/>

<img src="assets/rail/rail6.png"   width="60%" height="60%"/>



<video src="/video/1.mp4" style="max-width:100%" controls> </video>

If you find this work useful, or if it helps you in your research on rail joints, we kindly ask that you cite this paper:
```
@article{yin2018investigation,
  title={Investigation of relationship between train speed and bolted rail joint fatigue life using finite element analysis},
  author={Yin, Hao and Qian, Yu and Edwards, J Riley and Zhu, Kaijun},
  journal={Transportation Research Record},
  volume={2672},
  number={10},
  pages={85--95},
  year={2018},
  publisher={SAGE Publications Sage CA: Los Angeles, CA}
}
```