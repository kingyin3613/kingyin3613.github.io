# Learning constitutive laws from full-field measurements

Constitutive models are the bottleneck of predictive simulation for high-performance alloys. Classical elastoplastic laws are calibrated against a handful of uniaxial coupon tests, and the fitted parameters rarely transfer to the multiaxial, path-dependent loading that components experience in service. At the same time, modern full-field measurement produces far richer data than those laws can absorb: every pixel of a Digital Image Correlation (DIC) map and every diffraction peak of an Energy Dispersive X-ray Diffraction (EDXRD) spectrum carries information about the local stress and strain state. This project asks a simple question: can we learn the constitutive law directly from such data, under realistic loading conditions, without first forcing it into a hand-picked functional form?

<p align="center">
<img src="/assets/ml/rno_pipeline.svg"   width="100%" height="100%"/>
</p>

## Full-field stress and strain from EDXRD and DIC

The experimental side of the work is an in-situ, non-destructive framework that combines two complementary measurements on the same specimen during mechanical loading:

- `EDXRD` resolves the elastic lattice strain of the crystal, which is proportional to the local stress, through the shift of diffraction peaks. Using a lab-based, energy-dispersive setup rather than a synchrotron makes the technique accessible for routine material characterisation.
- `DIC` tracks the total surface strain field, including the plastic part, from optical images of a speckle pattern.

Together they provide paired stress and strain histories at many material points, for load paths that are not restricted to uniaxial tension. The framework has been applied to several alloys of engineering interest, including additively manufactured and rolled Ti-6Al-4V, Ti-6242, and Al 7075. A companion effort on the *democratisation* of lab-based EDXRD aims to make these enhanced datasets widely available for data-driven mechanics (see the publication list).

## Recurrent neural operator as a constitutive model

The learning side replaces the hand-written yield function and hardening rule with a `Recurrent Neural Operator (RNO)`. A constitutive law is a map from a strain *history* to the current stress, and classical plasticity encodes that history through internal variables (plastic strain, back stress, accumulated slip). The RNO keeps exactly this structure: a small set of hidden internal variables $\boldsymbol{\xi}$ is updated by a learned function at each increment, and the stress is read out from the current strain and the internal state,

<div align="center">
$$\boldsymbol{\xi}_{n+1} = f_\theta\left(\boldsymbol{\xi}_n, \boldsymbol{\varepsilon}_{n}, \Delta\boldsymbol{\varepsilon}\right), \qquad \boldsymbol{\sigma}_{n+1} = g_\theta\left(\boldsymbol{\xi}_{n+1}, \boldsymbol{\varepsilon}_{n+1}\right).$$
</div>

<p align="center">
<img src="/assets/ml/rno_cell.svg"   width="90%" height="90%"/>
</p>

Because the update is written at the level of increments rather than at a fixed time step, the learned operator is independent of the discretisation used in training and can be driven by an arbitrary strain path. This is what makes it usable as a drop-in material model inside a finite element or lattice solver.

Two properties of the measured data shape the training problem:

- **Noise.** Diffraction-based stresses and DIC strains are both noisy, and the noise is heteroscedastic. The training objective and the architecture are chosen so that the operator fits the underlying elastoplastic response rather than the measurement noise.
- **Realistic loading.** The data come from load paths that include unloading, reloading and non-proportional components, so the learned law is exercised in the regime where phenomenological models usually fail, instead of being extrapolated into it.

## Where this is going

The two halves of the project form a closed loop: the learned law predicts the response under a new load path, the prediction is tested in-situ, and the discrepancy tells us which experiment to run next. The longer-term goal is a measurement-to-model workflow for alloys in which the constitutive description is updated continuously as data accumulate, with the same lattice and finite element tools I use for the fracture of wood, concrete and composites as the downstream consumers.

This project is funded by DARPA, U.S. Department of Defense, and is carried out in the Cambridge Solid Mechanics Group with Prof. Vikram Deshpande.
