# Two-way coupling framework for multiphysics analyses of lattice models

As previously introduced, topologically dual systems of lattice models can be used to represent one- or two-way couplings involving the network structure and field variables of interest. There are various forms of coupling. One way is to introduce simultaneous coupling of field variables within theoretical formulations using, for instance, the effective stress concept of Biot. Alternatively, a sequential procedure can be used whereby one set of field variables is calculated separately, assuming the other field variables are in a steady-state condition. In many cases, results from the potential field analyses are used in the mechanical analyses. Iterative solutions can account for interplay between the different field variables within each computational cycle, which may better account for the path-dependent, irreversible nature of crack propagation. Coupled multiphysics processes are also central to several geoscience applications, where considerable progress has been made in modeling.

<p align="center">
<img src="assets/coupling/schematic.png"   width="100%" height="100%"/>
</p>

<p align = "center">
<small>
<span style="color:grey">
Image credit: Shen, Lei. Personal communication
</span>
</small>
</p>

In contrast to continuous or other discrete models, in which the same nodal sites are often used to represent mechanical (i.e., displacements) and flow-related quantities (e.g., moisture content and temperature), in topologically dual systems of lattice models, the nodal sites of the transport/flow network and mechanical lattices are always different. Furthermore, a challenge arises if different solvers are chosen for different analyses (e.g., explicit for mechanical solver, implicit for flow solver), as the time step sizes would then vary substantially. Different meshes and time scales of the coupled fields can complicate the coupling process (also referred to as "multidomain" or "multimodel" coupling). In the following section, a framework for coupled analyses of lattice models will be discussed.

<p align="center">
<img src="assets/coupling/MLDPM0.png"   width="90%" height="90%"/>
</p>

## Inter-process communication

Inter-process communication (IPC) refers to the coordination of activities among cooperating processes. This communication could involve a process letting another process know that some event has occurred or the transferring of data from one process to another.
For our applications of IPC in solving Multiphysics problems, the processes are different simulation solvers (e.g., Abaqus/Ansys/in-house codes/other solvers). 

We used named pipes as the IPC media. Named pipe is a simple synchronized way of passing information between two processes. A pipe can be viewed as a special file that can store only a limited amount of data and uses a "First In First Out (FIFO)" access scheme to retrieve data. In a logical view of a pipe, data is written to one end and read from the other.


<p align="center">
<img src="assets/coupling/namedpipes.png"   width="85%" height="85%"/>
</p>

## Coupling schemes

During a two-way coupling analysis, each process suspends operations periodically at one of two locations, referred to as synchronization points, and performs a data exchange with the coupled process. The first synchronization point is located at the initialization step of the analysis, prior to commencing the first time increment. This synchronization point will be called only once and, hence, allows for initial configurations to be exchanged between processes. The second synchronization point occurs at the end of a completed increment when the target time is reached in each process. This synchronization point is called multiple times as the simulation advances in time. At every synchronization point each process waits to receive the requested data from the coupled process before continuing. Therefore, for a two-way coupled simulation the synchronization point represents a point when both analyses coincide in solution time.

### Coupling scheme

Parallel explicit coupling scheme (Jacobi):
in a parallel explicit coupling scheme, both simulations are executed concurrently, exchanging fields to update the respective solutions at the next target time. This scheme is more efficient in the use of computing resources; less stable than the sequential scheme.

Sequential explicit coupling scheme (Gauss-Seidel):
in a sequential explicit coupling scheme, the simulations are executed in sequential order. One analysis leads while the other analysis lags the co-simulation.

Below is an illustration of the parallel coupling scheme that is used in this work, the horizontal lines represent simulation time. The vertical lines represent increments (or time steps) for a particular analysis in the coupled simulation. The dashed arrows denote data exchange in the direction of the arrowheads between the analysis codes.

<p align="center">
<img src="assets/coupling/couplingscheme.png"   width="60%" height="60%"/>
</p>

### Time incrementation scheme

Sometimes the coupled two processes may have very distinct scales of time increments (e.g., for a coupled poromechanics problem, explicit mechanical analysis has a stable time increment typically ranged $10^{-7}$-$10^{-3}$ s, while implicit transport/flow analysis has no stable time increment requirement, but for better convergence a time increment ranged $10^{-3}$-$10^{1}$ s is used).

Given the time increments differ largely, one may use time scaling factor to scale the time increment of one analysis for the synchronization, or use other technique such as subcycling time incrementation scheme. In subcycling, the analysis with larger time increment (generally, implicit analysis) ramps loads from the values of the previous coupling step to the values at the target time; In the analysis with smaller time increment (generally, explicit analysis) the loads are applied at the start of the coupling step and kept constant over the coupling step. The time interpolation may be used. 

<p align="center">
<img src="assets/coupling/incrementationscheme.png"   width="60%" height="60%"/>
</p>

## Application of two-way coupling framework: the Multiphysics-Lattice Discrete Particle Model (M-LDPM)

Previously proposed as a discrete flow model, the Flow Lattice Model (FLM) has proved its capability of capturing the heterogeneity and tortuosity in mass 
transport and heat transfer in mesoscale structure of concrete, through a discrete dual mesh of Lattice Discrete Particle Model. Now coupled with LDPM, the multiphysics problems such as the 
thermal-hydro-mechanical problem can be solved in a two-way coupled FLM-LDPM analysis framework with the help of the Interprocess Communication (IPC). 
The periodic data communication between two Abaqus solvers (Abaqus/standard for the thermal/diffusion part and Abaqus/Explicit for 
the mechanical part) and spatial & temporal mappings between the two solvers allow the coupling process to run smoothly and robustly. 

<p align="center">
<img src="assets/coupling/MLDPM.png"   width="100%" height="100%"/>
</p>

### Example 1: linear Terzaghi’s 1D consolidation

The first application of the two-way coupling framework is a famous, classical poromechanics problem: 1D Terzaghi's consolidation. A prism of material of length $L = 0.5$ m and square cross-section $0.1\times0.1$ m$^3$ is initially under zero pressure and zeros strain, then is loaded by a boundary pressure. The $x$ axis runs along its longest central axis, the domain begins at
$x = 0$ m and ends at $x = 0.5$ m. The prism is sealed at all boundaries except the front end at $x = 0$ where pressure $p^{*}$ is prescribed at time $t = 0$ and kept constant throughout the simulation. The mechanical boundary conditions prescribe
zero rotations at all boundaries, zero $x$ displacement at the rear end at $x = 0.5$ m and zero $y$ and $z$ displacements at
all rectangular sides. Biot coefficient $b = 0.5$ and reference pressure $p_0 = 0$ MPa. This is a very typical poroelasticity problem, so linear elastic mechanical behavior is assumed.

<p align="center">
<img src="assets/coupling/terzaghi.png"   width="75%" height="75%"/>
</p>

The analytical solution can be found in [Detournay and Cheng 1993](https://geo.mff.cuni.cz/seismosoft/clanky/Detournay.Cheng.Fundamentalsofporoelasticity.1993.pdf): 

$$
p(\chi, \tau)=p^{\star} F_1(\chi, \tau) \quad u(\chi, \tau)=-\frac{p^{\star} \Upsilon L}{G} F_2(\chi, \tau)
$$

where

$$
F_1(\chi, \tau)=1-\sum_{m=1,3, \ldots}^{\infty} \frac{4}{m \pi} \sin \left(\frac{m \pi \chi}{2}\right) \exp \left(-m^2 \pi^2 \tau\right)$$

$$
F_2(\chi, \tau)=\sum_{m=1,3, \ldots .}^{\infty} \frac{8}{m^2 \pi^2} \cos \left(\frac{m \pi \chi}{2}\right)\left[1-\exp \left(-m^2 \pi^2 \tau\right)\right]
$$

$$\chi=\frac{x}{L} \quad \tau=\frac{\lambda t}{4 C L^2} \quad Y=\frac{b(1-2 \nu)}{2(1-\nu)}$$
$$G=\frac{E}{2(1+\nu)} \quad C=\frac{\left(1-\nu_u\right)(1-2 \nu)}{M_b(1-\nu)\left(1-2 \nu_u\right)}$$
$$M_b=\frac{1}{c} \quad \nu_u=\frac{3 K_u-2 G}{2\left(3 K_u+G\right)} \quad K_u=M_b b^2+\frac{E}{3(1-2 \nu)}$$

$E$ - Macroscopic Young's modulus, $\nu$ - Macroscopic Poisson's ratio,
$M_b$ - Biot modulus of the porous media (the reciprocal of
the storage coefficient $c$), $\lambda$ - permeability coefficient of the porous media.

The simulation results of M-LDPM are shown in figures and animations below.

<p align="center">
<video src="/videos/1DTerzaghi_loadbypressure.webm" style="max-width:75%" controls> </video>
</p>

<p align = "center">
<small>
<span style="color:grey">
Transient pressure contours in prism
</span>
</small>
</p>

<p align="center">
<img src="assets/coupling/1dterzaghi.png"   width="95%" height="95%"/>
</p>

### Example 2: Radial poroelastic expansion of pressurized cylindrical disk
The capability of the two-way coupling framework to simulate the interaction of flow and mechanical response is also demonstrated by analysing the fluid pressure and elastic radial displacement distributions in a thick-walled cylindrical disk subjected to a influx fluid pressure. A hollow disk of inner radius $r_i$ and outer radius $r_o$ is loaded by constant fluid pressure, $P_ {fi}$ on the inner surface. Zero pressure is prescribed on the outer surface and zero boundary flux is prescribed on the top and bottom surfaces.

<p align="center">
<img src="assets/coupling/poro.png"   width="75%" height="75%"/>
</p>

This is essentially an one-way coupling situation, the uncoupled radial fluid pressure $P_f$ diffused from the inner surface throughout a thick-walled cylinder, at the steady-state, the fluid pressure field can be expressed as:

$$
P_{\mathrm{f}}=P_{\mathrm{fi}} \frac{\ln \frac{r_0}{r_r}}{\ln \frac{r_0}{r_{\mathrm{i}}}}
$$

The fluid pressure is then passed to the mechanical lattices through the M-LDPM framework, leads to the radial expansion (displacement) in the thin-walled cylinder. The analytical solution can be found in [Grassl et al. 2015](https://doi.org/10.1016/j.jmps.2014.11.011): 

<p align="center">
<img src="assets/coupling/eq1.png"   width="75%" height="75%"/>
</p>

where 
$$ \bar{u} =\frac{u}{r_i} \quad \bar{r}=\frac{r}{r_i} \quad \bar{r}_o=\frac{r_o}{r_i}$$

$$ \bar{P}_f =\frac{P_f}{E_c} $$ 

$$\bar{P}_ {fi}=\frac{P_{fi} }{E_c} $$

$$ E_c =\frac{2+3 \alpha}{4+\alpha} E_0 \quad \nu=\frac{1-\alpha}{4+\alpha}$$

$E_c$ - Macroscopic Young's modulus, $\nu$ - Macroscopic Poisson's ratio,
$E_0$ - Mesoscopic Young's modulus, $\alpha$ - Mesoscopic shear-normal coupling coefficient.

The simulation results of M-LDPM are shown in figures and animations below.

<p align="center">
<img src="assets/coupling/grasslDisk_nu0_300dpi.png"   width="50%" height="50%"/>
</p>

<p align = "center">
<small>
<span style="color:grey">
Normalized radial expansions v.s. normalized radii, macrosopic Poisson's ratio = 0
</span>
</small>
</p>

<p align="center">
<img src="assets/coupling/grasslDisk_nu01_300dpi.png"   width="50%" height="50%"/>
</p>

<p align = "center">
<small>
<span style="color:grey">
Normalized radial expansions v.s. normalized radii, macrosopic Poisson's ratio = 0.1
</span>
</small>
</p>

<p align="center">
<img src="assets/coupling/grasslDisk_nu02_300dpi.png"   width="50%" height="50%"/>
</p>

<p align = "center">
<small>
<span style="color:grey">
Normalized radial expansions v.s. normalized radii, macrosopic Poisson's ratio = 0.2
</span>
</small>
</p>

<p align="center">
<video src="/videos/grasslDisk.webm" style="max-width:75%" controls> </video>
</p>

<p align = "center">
<small>
<span style="color:grey">
Transient pressure contours in cylindrical disk
</span>
</small>
</p>

<p align="center">
<video src="/videos/grasslDisk_eigensig.webm" style="max-width:75%" controls> </video>
</p>

<p align = "center">
<small>
<span style="color:grey">
Transient imposed stress contours in cylindrical disk
</span>
</small>
</p>

### Example 3: hydraulic fracturing of pressurized cylindrical disk
The fracture behavior, as well as the interaction between pressure flow and fracture is demonstrated in this example. The same cylindrical disk used in example 2 is again used here. This time, however, the mechanical behaviors of the material is not purely elastic anymore, we use the material constitutive model describing the softening and fracture behavior of quasi-brittle materials in this [LDPM 2011 paper](https://www.sciencedirect.com/science/article/abs/pii/S0958946511000345). The nonlinear constitutive behaviors of the material will not only introduce the change in mechanical behavior, it will also affect the pressure flow by introducing the changes in transport properties due to crack openings (e.g., the growth of crack openings leads to higher pressure permeability in local microstrcture).
Loading by pressure, the Biot coefficient introduces pressure to contribute to the formation of crack opening (through imposed normal stress). This two-way coupling procedure is summarized in figure below, for the detailed derivation of model formulation, one can refer to this paper [Li et al. 2018](https://link.springer.com/article/10.1007/s00603-018-1625-8).

<p align="center">
<img src="assets/coupling/poro_fracture.png"   width="75%" height="75%"/>
</p>

As shown in figures and animations below, as cracks grow, the pressure distribution is not axial-symmetric anymore: the pressure distribution tends to "follow" the cracks. The crack openings result in an easy pressure "invasion" in these locations, due to the higher permeability of pressure. Higher pressure diffuses alongside the crack paths, leading to the conentration of impose stress and even faster move of crack tips.

<p align="center">
<img src="assets/coupling/grasslDiskt0.png"   width="95%" height="95%"/>
</p>

<p align = "center">
<small>
<span style="color:grey">
crack opening and pressure contours at time t=0.3total time
</span>
</small>
</p>

<p align="center">
<img src="assets/coupling/grasslDiskt1.png"   width="95%" height="95%"/>
</p>

<p align = "center">
<small>
<span style="color:grey">
crack opening and pressure contours at time t=0.7total time
</span>
</small>
</p>

<p align="center">
<img src="assets/coupling/grasslDiskt2.png"   width="95%" height="95%"/>
</p>

<p align = "center">
<small>
<span style="color:grey">
crack opening and pressure contours at time t=1.0total time
</span>
</small>
</p>

<p align="center">
<video src="/videos/fracture2.webm" style="max-width:75%" controls> </video>
</p>

<p align = "center">
<small>
<span style="color:grey">
Transient crack paths in fractured cylindrical disk
</span>
</small>
</p>

<p align="center">
<video src="/videos/fracture.webm" style="max-width:75%" controls> </video>
</p>

<p align = "center">
<small>
<span style="color:grey">
Transient pressure contours in fractured cylindrical disk
</span>
</small>
</p>