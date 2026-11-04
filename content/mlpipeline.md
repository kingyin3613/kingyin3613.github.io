# Data-driven mechanics pipelines

Most of the value of machine learning in mechanics is lost between the experiment and the model. Measurements arrive in instrument-specific formats, calibration and registration are done by hand, simulation inputs are assembled manually, and the learned model is rarely connected back to the solver that is supposed to use it. A recurring theme across my projects has been to build the pipeline that closes this gap: an automated, Python-based workflow from raw data to a design decision, in which the learning step is one stage among several rather than an isolated exercise.

<p align="center">
<img src="/assets/ml/datadriven_pipeline.svg"   width="100%" height="100%"/>
</p>

## Stages of the pipeline

- **Acquire.** Mechanical tests with full-field instrumentation (EDXRD, DIC, in-situ X-ray CT), together with lattice and finite element simulations that are run programmatically to fill in regions of the input space that are expensive or impossible to test.
- **Curate.** Cleaning, registration between measurement modalities, quantification of noise and uncertainty, and versioning, so that every learned model can be traced back to the dataset it was trained on.
- **Learn.** Neural operators for history-dependent constitutive behaviour, graph networks for architected solids, and simpler surrogates where they suffice. Physical constraints (objectivity, thermodynamic consistency, known elastic limits) are built in wherever possible, because the datasets are small by machine learning standards and the constraints do a great deal of the work.
- **Deploy.** The learned model is wrapped as a material subroutine or a design rule inside the downstream tool: Abaqus user elements for lattice models, MOOSE applications, or an engineer-facing design application.
- **Evaluate.** Held-out experiments, rather than held-out samples from the same experiment, are the test; and the evaluation decides which experiment or simulation to run next.

## Examples

**Automated workflow for mass timber (NSF CMMI-1762757).** An end-to-end Python workflow for material modelling, structural analysis and data post-processing of engineered wood products, built around the [Connector-Beam Lattice model](/paper-detail?paper=cbl) and the [RingsPy](https://github.com/kingyin3613/ringspy) mesh generator. Material models are generated from microstructural statistics, large lattice simulations (more than ten million elements) are launched and post-processed without manual intervention, and the resulting property data feed the structural design stage. The workflow significantly shortened the design cycle for timber structures.

**Timber design software for impact loading (ERDC).** A user-facing timber structural design tool for impact scenarios, built on FreeCAD, that sits at the deployment end of the dynamic lattice model (dynaCBL) developed in the same project.

**Measurement-to-model workflow for alloys (DARPA).** The in-situ EDXRD and DIC measurement framework and the recurrent neural operator described on the page [Learning constitutive laws from full-field measurements](/paper-detail?paper=rno) are the acquire and learn stages of one such pipeline; the learned law is deployed in finite element analyses of the tested alloys.

**Data-driven pipeline for the MT3.0 protocol.** An ongoing effort to package the same approach as a reusable, open pipeline: [mt3-rnn-pipeline](https://github.com/kingyin3613/mt3-rnn-pipeline).

## Why this matters

Pipelines are not glamorous, but they are what makes the learned models reproducible, and what lets the same machinery move between materials. The wood, concrete, alloy and metamaterial work on this site share more of their software than their physics.
