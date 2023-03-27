# Two-way coupling framework for Multiphysics-LDPM

Previously proposed for Multiphysics-LDPM (M-LDPM), the Flow Lattice Model (FLM) has proved its capability of capturing the mass transport and heat transfer with a discrete-type dual mesh of LDPM. Now coupled with LDPM, the multiphysics problems such as the thermal-hydro-mechanical problem can be solved in a two-way coupled FLM-LDPM analysis framework with the help of the Interprocess Communication (IPC). The periodic data communication between two Abaqus solvers (Abaqus/standard for the thermal/diffusion part and Abaqus/Explicit for the mechanical part) and spatial & temporal mappings between the two solvers allow the coupling process to run smoothly and robustly. 

## Writing content

Learn how to write your `content/`, supporting Markdown, YAML, CSV and JSON: https://content.nuxtjs.org/writing.

## Fetching content

Learn how to fetch your content with `$content`: https://content.nuxtjs.org/fetching.

## Displaying content

Learn how to display your Markdown content with the `<nuxt-content>` component directly in your template: https://content.nuxtjs.org/displaying.
<img src="assets/8.png"   width="50%" height="50%"/>

<vieo sec="https://haoyin.io/assets/8.png/Cube_Notched_38x38mm_a0_QML_v10_abq.mp4" /> 