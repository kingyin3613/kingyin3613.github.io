# Discrete models for transport phenomena
In this section, two discrete models for transport phenomena for porous materials will be presented, one is called the `Flow Cell Model (FCM)` for the hygral-thermal behaviors of wood at the mesoscale level. The `FCM` uses the topologically dual structure of the Voronoi-based `Connector-Beam Lattice Model (CBL)`, a Delaunay lattice network, as the transport system. 
Another work that will be introduced is called three-dimensional `Flow Lattice Model (FLM)` with application to the Hygro-Thermo-Chemical (HTC) model for analysis of moisture transport and heat transfer in cementitious materials.
The `FLM` is a discrete transport model formulated in association with a mechanical model for mesoscale structure of concrete, the `Lattice Discrete Particle Model (LDPM)`. These two models enables the simulation of transport phenomena at the length scale at which the material exhibits <b>intrinsic heterogeneity</b>.

## Discretization of the scalar potential field variable(s)

In the two mentioned methods, the field quantity is transported along 1D conduit elements interconnected at the nodal sites. In the absence of
cracking, it is common to use the same nodal sites for representing the mechanical (i.e., displacements) and flow-related quantities
(e.g., moisture content and temperature). By scaling the cross-section areas of the conduit elements
according to the corresponding joint surface areas of lattice elements for mechanical analysis, the lattice of conduit elements can precisely represent uniform flow conditions. 

<p align="center">
<img src="assets/flow/edgenetwork1.png"   width="75%" height="75%"/>
</p>

By virtue of nodal site symmetry of topologically dual systems, regular lattices of conduit elements represent the condition of uniform flow through
a homogeneous medium. The same capability is achieved with irregular lattices, provided the element areas are based on the
corresponding joint surface areas of lattice elements for mechanical analysis (or potentially some other means of tiling the domain with the individual
element volumes). Mass conservation calculations for flow entering/leaving each wood cell (for `FCM`) or LDPM tetrahedron (for `FLM`) provide nodal flux values, which can serve as a basis
for stream line visualization.


<p align="center">
<img src="assets/flow/discreteflow.png"   width="55%" height="55%"/>
</p>

<p align="center">
<img src="assets/flow/FLM.png"   width="70%" height="70%"/>
</p>

## Flow field analyses of wood (or other prismatic cellular materials)

Under construction!

## Flow field analyses of concrete

The HTC theoretical formulation is based on mass and energy conservation laws, written using humidity and temperature as primary variables, and taking into account explicitly various chemical reactions, e.g. cement hydration and silica fume reaction, as internal variables. In this work, the HTC formulation was extended to include the effect of temperature on the sorption isotherm.
The `FLM` solutions were compared with those of a continuum finite element implementation of the HTC model and experimental data available from the literature; the overall agreement demonstrates the reliability of the proposed approach in reproducing phenomena such as cement hydration, self-desiccation, temperature-dependent moisture drying, etc.

For the transport problem of water mass and heat in concrete, the relative humidity $h$ and temperature $T$ are selected as the primary fields (a.k.a. the degrees of freedom in numerical analyses). The values at node sites $N_1$ and $N_2$ in each `Flow Lattice Element (FLE)`, i.e., $h_{i}$, $T_{i}$ ($i=1,2$) represent the mass thermodynamic state in the control volume of the FLE. 

The water mass and heat balance equations in a FLE control volume $V$ consisting of $V_1$ and $V_2$, can be obtained from mass and enthalpy conservation laws, which read

\begin{align}
V_{1}\dot{w}+A j_{h}&=0 \label{eq:mass_a}
    &
	V_{1}\dot{U}+A j_{T}+V_{1}q_T&=0
	&
	V_{2}\dot{w}-A j_{h}&=0
    &
	V_{2}\dot{U}-A j_{T}+V_{2}q_T&=0
\end{align} 

where the dot accents denote the time rates of variables, $w=w(h,T)$ and $U=U(h,T)$ stand for the total water mass content and internal energy per unit volume, $j_h$ and $j_T$ stand for the flux density of water mass and heat per unit time associated with the projected section area $A$, a positive flux is defined entering $V_1$ from $V_2$; $q_h$ and $q_T$ are the source/sink term of water mass and heat energy. 
$q_T$ stands for the source term of thermal energy. The material volumes $V_{1}$, $V_{2}$, and their common projected section area $A$ are considered to be constant in this study.

The total water content $w$, can be expressed as $w=w_e+w_n$, where $w_e$ represents the evaporable water portion, which comprises capillary water, water vapor, and adsorbed water, and $w_n$ represents the non-evaporable (chemically bound) water. 
The relation between the evaporable water and relative humidity $h$, is the so called sorption isotherm which is here assumed also to be function of temperature $T$, the degree of hydration, $\alpha_c$, and the degree of silica-fume reaction, $\alpha_{s}$, i.e., $w_e = w_e(h, T, \alpha_c, \alpha_{s})$ (age-dependent adsorption/desorption isotherm). The water content variation in time reads

$$
\dot{w} = \dot{w}_e+ \dot{w}_n = \frac{\partial w_e}{\partial h} \dot{h} + \frac{\partial w_e}{\partial T} \dot{T} + \frac{\partial w_e}{\partial \alpha_c} \dot{\alpha}_c + \frac{\partial w_e}{\partial \alpha_{s}} \dot{\alpha}_{s} + \dot{w}_n 
$$

where $\partial w_e / \partial h$ is the slope of the sorption isotherm (also called moisture capacity), $\partial w_e / \partial T$ represents the variation of the evaporable water with respect to the temperature variation, and the last three terms express the effect of concrete aging on the diffusion process; 
the first two terms account for the microstructural changes associated with the concrete chemical reactions and the last term accounts for the internal "consumption" of water involved in the chemical reactions, called moisture sink, explains the well-known self-desiccation phenomenon. 

The `FLM` is implementated through the Abaqus user element subroutines for implicit analyses, named `UEL`. Generally, for a `UEL`, users should calculate the linearized governing equations (incremental form) for the nonlinear problems, by providing the Jacobian (a.k.a. the tangent stiffness) matrix `AMATRX` and the right hand side (a.k.a. the residual) vector `RHS` of the incremental governing equations to the Abaqus solver, to calculate the nodal increments of degrees of freedom for user elements during each iteration, until the convergence is reached. The remaining parts, such as matrix assemblage and matrix solving, are automatically processed by the Abaqus solver for implicit analyses `Abaqus/Standard`.

## Homogenization of discrete flow 

Under construction!

<p align="center">
<img src="assets/8.png"   width="75%" height="75%"/>
</p>

Related work of discrete modeling of transport/flow phenomena can be found in this paper:

```
@article{yin2022generalized,
  title={Generalized Formulation for the Behavior of Geometrically Curved and Twisted Three-Dimensional Timoshenko Beams and Its Isogeometric Analysis Implementation},
  author={Yin, Hao and Lale, Erol and Cusatis, Gianluca},
  journal={Journal of Applied Mechanics},
  volume={89},
  number={7},
  pages={071003},
  year={2022},
  publisher={American Society of Mechanical Engineers}
}
```

Related work of homogenization of discrete transport/flow can be found in this paper:

```
@article{eliavs2022homogenization,
  title={Homogenization of discrete diffusion models by asymptotic expansion},
  author={Eli{\'a}{\v{s}}, Jan and Yin, Hao and Cusatis, Gianluca},
  journal={International Journal for Numerical and Analytical Methods in Geomechanics},
  volume={46},
  number={16},
  pages={3052--3073},
  year={2022},
  publisher={Wiley Online Library}
}
```