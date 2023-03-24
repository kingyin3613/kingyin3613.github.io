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

<img src="assets/rail/rail1.png"   width="100%" height="100%"/>

All the parts (i.e. wheel, rail, rail joint) were assumed to behave elastically in the dynamic FE analysis and a correction of long-term behavior of materials was performed in conjunction with the fatigue life analysis. The Young’s modulus, Poisson’s ratio, and the density of the wheel, rails, rail joints, and bolts were assigned as 29,000 ksi (199.9 GPa), 0.33, and 0.283 lb/in3 (7,833.4 kg/m3), respectively. The supporting system (e.g. crosstie, ballast, etc.) was represented in the model by linear spring and dashpot elements, with details of the simplifications included in an earlier publication (8). k_t and C_t were the spring stiffness and damper coefficients, and the equivalent springs and dampers were ones contributed from the crosstie, rail pad, ballast, subgrade, etc. Using a track modulus of 4,000 psi (27.58 MPa) provided by NYCTA and results from previous research pertaining to equivalent springs and dampers, k_t=90,000 lbf/in. (15,761 kN/m) and C_t=90 lbf∙s/in. (15.76 kN∙s/m) were selected. Similarly, k_w and C_w were the spring stiffness and damper coefficient of springs representing the suspension system of a train car and k_t=1,000 lbf/in. (175.13 kN/m) and C_t=0.8 lbf∙s/in. (0.14 kN∙s/m) were selected, which are consistent with other studies (10,11).

<img src="assets/rail/rail2.png"   width="100%" height="100%"/>

<img src="assets/rail/rail3.png"   width="70%" height="70%"/>

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