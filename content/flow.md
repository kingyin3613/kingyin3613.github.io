# Discrete models for transport phenomena
In this section, two discrete models for transport phenomena for porous materials will be presented, one is called the `Flow Cell Model (FCM)` for the hygral-thermal behaviors of wood at the mesoscale level. The `FCM` uses the topologically dual structure of the Voronoi-based `Connector-Beam Lattice Model (CBL)`, a Delaunay lattice network, as the transport system. 
Another work that will be introduced is called three-dimensional `Flow Lattice Model (FLM)` with application to the Hygro-Thermo-Chemical (HTC) model for analysis of moisture transport and heat transfer in cementitious materials.
The `FLM` is a discrete transport model formulated in association with a mechanical model for mesoscale structure of concrete, the `Lattice Discrete Particle Model (LDPM)`. These two models enables the simulation of transport phenomena at the length scale at which the material exhibits intrinsic <b>heterogeneity</b> and <b>tortuosity</b> of flow paths.

## Discretization of the scalar potential field variable(s)

In the two mentioned methods, the field quantity is transported along 1D conduit elements interconnected at the nodal sites. In the absence of
cracking, it is common to use the same nodal sites for representing the mechanical (i.e., displacements) and flow-related quantities
(e.g., moisture content and temperature). By scaling the cross-section areas of the conduit elements
according to the corresponding joint surface areas of lattice elements for mechanical analysis, the lattice of conduit elements can precisely represent uniform flow conditions. 

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

## Flow field analyses of concrete
This study presents the formulation and validation of a 3D Flow Lattice Model (FLM) with application to the Hygro-Thermo-Chemical (HTC) model for analysis of moisture transport and heat transfer in cementitious materials.
The FLM is a discrete transport model formulated in association with meso-mechanical models of concrete, such as the Lattice Discrete Particle Model (LDPM).

<p align="center">
<img src="assets/flow/LDPM.png"   width="95%" height="95%"/>
</p>

The [Hygro-thermo-chemical (HTC) theoretical formulation](https://www.sciencedirect.com/science/article/pii/S0958946509000420?casa_token=EyLQzc4glHQAAAAA:2tCW6F4x5fzQwVr8MB3_u9gMwtoR0yxMpR6vcmYtrk_zulzFOQUq05_vPMV_0UdFTiUb2kJ1), originally proposed by Di Luzio et al. in 2011, is based on mass and energy conservation laws, written using humidity and temperature as primary variables, and taking into account explicitly various chemical reactions, e.g., cement hydration and silica fume reaction, as internal variables. In this work, the HTC formulation was extended to include the effect of temperature on the sorption isotherm.

For the transport problem of water mass and heat in concrete, the relative humidity $h$ and temperature $T$ are selected as the primary fields (a.k.a., the degrees of freedom in numerical analyses). The values at node sites $N_1$ and $N_2$ in each `Flow Lattice Element (FLE)`, i.e., $h_{i}$, $T_{i}$ ($i=1,2$) represent the mass thermodynamic state in the control volume of the FLE. 

<p align="center">
<img src="assets/flow/edgenetwork1.png"   width="75%" height="75%"/>
</p>

Three types of FLE exist as depicted in the figure below: regular (or type 1) elements - all interior elements belong to this category; transitional layer (or type 2) elements, which corresponds to the elements having two nodes - one interior tet point and the other on the boundary of the whole model; boundary layer (or type 3) elements, which shares the node on the boundary of a type 2 element, and then extends orthogonally to the outside of the model boundary. Different from type 1 and type 2, the boundary layer element consists of two triangular prisms with equal volumes $V_{1}=V_{2}$ and equal segment lengths $l_{1}=l_{2}$. Type 3 elements are used to enforce the boundary conditions; details will be discussed in following sections. The formulation of FLEs is the same for all types of elements, but the term values are governed by the geometric properties of different element types.

<p align="center">
<img src="assets/flow/edge_elem_type.png"   width="80%" height="80%"/>
</p>

The water mass and heat balance equations in a FLE control volume $V$ consisting of $V_1$ and $V_2$, can be obtained from mass and enthalpy conservation laws, which read

$$
V_{1}\dot{w}+A j_{h}=0 ~~~~~~ V_{1}\dot{U}+A j_{T}+V_{1}q_T=0 ~~~~~~ V_{2}\dot{w}-A j_{h}=0 ~~~~~~ V_{2}\dot{U}-A j_{T}+V_{2}q_T=0
$$

where the dot accents denote the time rates of variables, $w=w(h,T)$ and $U=U(h,T)$ stand for the total water mass content and internal energy per unit volume, $j_h$ and $j_T$ stand for the flux density of water mass and heat per unit time associated with the projected section area $A$, a positive flux is defined entering $V_1$ from $V_2$; $q_h$ and $q_T$ are the source/sink term of water mass and heat energy. 
$q_T$ stands for the source term of thermal energy. The material volumes $V_{1}$, $V_{2}$, and their common projected section area $A$ are considered to be constant in this study.

The total water content $w$, can be expressed as $w=w_e+w_n$, where $w_e$ represents the evaporable water portion, which comprises capillary water, water vapor, and adsorbed water, and $w_n$ represents the non-evaporable (chemically bound) water. 
The relation between the evaporable water and relative humidity $h$, is the so called sorption isotherm which is here assumed also to be function of temperature $T$, the degree of hydration, $\alpha_c$, and the degree of silica-fume reaction, $\alpha_{s}$, i.e., $w_e = w_e(h, T, \alpha_c, \alpha_{s})$ (age-dependent adsorption/desorption isotherm). The water content variation in time reads

$$
\dot{w}=\dot{w}_e + \dot{w}_n = \frac{\partial w_e}{\partial h} \dot{h} + \frac{\partial w_e}{\partial T} \dot{T} + \frac{\partial w_e}{\partial \alpha_c} \dot{\alpha}_c + \frac{\partial w_e}{\partial \alpha_s} \dot{\alpha}_s + \dot{w}_n 
$$

where $\partial w_e / \partial h$ is the slope of the sorption isotherm (also called moisture capacity), $\partial w_e / \partial T$ represents the variation of the evaporable water with respect to the temperature variation, and the last three terms express the effect of concrete aging on the diffusion process; 
the first two terms account for the microstructural changes associated with the concrete chemical reactions and the last term accounts for the internal "consumption" of water involved in the chemical reactions, called moisture sink, explains the well-known self-desiccation phenomenon. 

For the temperature range considered in this study (10-100 $^\circ$ C), no phase change is happening in concrete, hence the thermal energy variation in time reads $\dot{U}=\rho c_t\dot{T}$, where $\rho$ is the mass density and $c_t$ is the isobaric heat capacity (specific heat) of concrete. The product $\rho c_t$ is the thermal capacity.

In this study, all moisture transport mechanisms are combined into a single phenomenological equation and the overall moisture transport process under isothermal conditions is described through an equivalent Fick's law $j_h=-D_{h}(h, T) g_h$, where $j_h$ is the flux density of water mass per unit time, $g_h$ is the discrete estimation of relative humidity gradient, which read $g_h=\mathbf{e} \cdot \mathbf{n}(h_2-h_1)/l$, the proportionality coefficient $D_{h}(h,T)$, called moisture permeability, is a nonlinear function of relative humidity $h$ and temperature $T$. Heat conduction can be described in concrete by classical Fourier's law as $j_T=-\lambda g_T $, where $j_T$ stands for the heat flux density per unit time, $g_T$ stands for the discrete estimation of the temperature gradient, which reads $g_T = \mathbf{e} \cdot \mathbf{n}(T_2-T_1)/l$.

The source term of thermal energy $q_T$, can be expressed as $ q_T = \dot{Q}_c+\dot{Q}_s $ , in which $\dot{Q}_c$ and $\dot{Q}_s$, represent the rate of heat generation per unit volume due to cement hydration and silica fume (pozzolanic) reaction, respectively.  

$$
\begin{aligned}
&\dot{Q}_c=\dot{\alpha}_c c \tilde{Q}_c^{\infty}\\
&\dot{Q}_s=\dot{\alpha}_s s \tilde{Q}_s^{\infty}
\end{aligned}
$$

where $\dot{\alpha_c}$ is the rate of the hydration degree, $c$ is the cement mass content, $\dot{\alpha_s}$ is the rate of pozzolanic reaction degree, and $s$ is the silica fume mass content.
The latent heat of hydration reaction per unit of hydrated mass, $ \tilde{Q}_c^{\infty} $, may be assumed constant for a given concrete as it depends only on the chemical composition of its cement. 

It can be measured in calorimetric tests at complete hydration and typical values are depending upon cement composition.
The enthalpy of silica fume, $\tilde{Q}_{s}^\infty$, can be assumed constant during hydration.

By substituting and collecting all the entries from equations described above, one can expand the governing equations as

$$
\begin{array}{r}
V_1\left(\frac{\partial w_e}{\partial h} \dot{h}+\frac{\partial w_e}{\partial T} \dot{T}+\frac{\partial w_e}{\partial \alpha_c} \dot{\alpha}_c+\frac{\partial w_e}{\partial \alpha_s} \dot{\alpha}_s+\dot{w}_n\right)+A D_h \frac{h_2-h_1}{l} \mathbf{e} \cdot \mathbf{n}=0 \\
\end{array}
$$
$$
\begin{array}{r}
V_1\left(\rho c_t \dot{T}+\dot{\alpha}_s s \tilde{Q}_s^{\infty}+\dot{\alpha}_c c \tilde{Q}_c^{\infty}\right)+A \lambda \frac{T_2-T_1}{l} \mathbf{e} \cdot \mathbf{n}=0 \\
\end{array}
$$
$$
\begin{array}{r}
V_2\left(\frac{\partial w_e}{\partial h} \dot{h}+\frac{\partial w_e}{\partial T} \dot{T}+\frac{\partial w_e}{\partial \alpha_c} \dot{\alpha}_c+\frac{\partial w_e}{\partial \alpha_s} \dot{\alpha}_s+\dot{w}_n\right)-A D_h \frac{h_2-h_1}{l} \mathbf{e} \cdot \mathbf{n}=0 \\
\end{array}
$$
$$
\begin{array}{r}
V_2\left(\rho c_t \dot{T}+\dot{\alpha}_s s \tilde{Q}_s^{\infty}+\dot{\alpha}_c c \tilde{Q}_c^{\infty}\right)-A \lambda \frac{T_2-T_1}{l} \mathbf{e} \cdot \mathbf{n}=0
\end{array}
$$


The `FLM` is implementated through the Abaqus user element subroutines for implicit analyses, named `UEL`. Generally, for a `UEL`, users should calculate the linearized governing equations (incremental form) for the nonlinear problems, by providing the Jacobian (a.k.a. the tangent stiffness) matrix `AMATRX` and the right hand side (a.k.a. the residual) vector `RHS` of the incremental governing equations to the Abaqus solver, to calculate the nodal increments of degrees of freedom for user elements during each iteration, until the convergence is reached. The remaining parts, such as matrix assemblage and matrix solving, are automatically processed by the Abaqus solver for implicit analyses `Abaqus/Standard`.

<p align="center">
<img src="assets/flow/solimansettings1.png"   width="65%" height="65%"/>
</p>

The `FLM` solutions were compared with those of a continuum finite element implementation of the HTC model and experimental data available from the literature. Two examples of concrete drying at early-age (left) and temperature-dependent desorption isotherm (right) are shown in figures below. 

<p align="center">
<img src="assets/flow/HD.png"   width="40%" height="40%"/>

<img src="assets/flow/isotherm.png"   width="40%" height="40%"/>
</p>

The overall agreement demonstrates the reliability of the proposed approach in reproducing phenomena such as cement hydration, self-desiccation, temperature-dependent moisture drying, etc.

For more details of related work of discrete modeling of transport/flow phenomena in concrete can be found in this paper:

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

## Flow field analyses of wood (or other prismatic cellular materials)

The porous meso-scale structure of wood creates a pathway (lumen) for the porous flow and other transportation processes through and across the cell walls. The existence of analogous micro-conduits (e.g. rays, pits) facilitate the moisture transport between cells. The orientation-dependent moisture transport features the anisotropy of poroflow of wood. A mesoscale 3D `Flow Cell Model (FCM)` for flow/transport phenomena of wood has been developed.

Similar to the `Flow Lattice Model`, 1D conduit element is also used to transport the scalar field quantities in `Flow Cell Model`. The interconnected node sites in the `Flow Cell Model` now represent the cell points located in the centroids of wood cells. The moisture transport in wood at the mescocale can be categorized into two main types: poroflow of liquid water and water vapor above the fiber saturation point (FSP), and the hygroscopic process of the wood cell walls at and below the FSP.

The moisture transport in bulk wood consists of poroflow of water vapor in tracheids (mainly through lumina), and the moisture transport in cell walls at the mesoscale, however, the contribution of water vapor moisture diffusion through tracheids is dominant. This is evident from the significantly larger moisture diffusivity (approx. 4–20 times) in the longitudinal direction of bulk wood than in the transverse (radial and tangential) directions. The orthotropy of moisture diffusivity will be reproduced by the microstructure and the differences in diffusivity of lumina and cell walls, while the orthotropy of heat transfer features a similar orientation-dependency as the moisture transport, the coupled hygro-thermal effects will be investigated with the help of the `Flow Cell Model`.

Under construction!


<p align="center">
<img src="assets/flow/FlowCellModel.png"   width="75%" height="75%"/>
</p>

## Homogenization of discrete flow 

Under construction!

<p align="center">
<img src="assets/8.png"   width="75%" height="75%"/>
</p>

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