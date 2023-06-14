// webGl效果配置文件
export default [
  {
    category: 'Computational modeling of micromechanics of wood, cross-laminated timber (CLT), and other fibrous materials',
    desc: 'A 3D discrete connector-beam lattice (CBL) model to simulate the mechanical behaviors of wood and engineered wood products (e.g., wood panel, CLT) at the mesoscale has been developed. The basic element of this lattice model is the 3D curved beam characterized by (a) arbitrary curvature and torsion of the beam axis and (b) an irregular, cruciform cross-section. The various branches for the cross-section represent the cell walls of the cellular wood microstructure and the beam axis is the line at which various cell walls meet. The Isogeometric Analysis (IGA) technique has been employed to describe the beam geometries accurately. The joints (both transverse and longitudinal) between neighboring beams are modeled with the "connector" elements, characterized by the smeared crack model for the cell wall failure and by the cohesive fracture laws for the softening strain-stress relationship of quasi-brittle materials (including wood, fiber-composites).' +
      '&nbsp;<br>' + 
	  '<br/>The beam lattice and connector elements have been implemented with Abaqus user subroutines "UEL" and "VUEL" for both implicit and explicit analyses. A preprocessing-analysis-postprocessing pipeline has been formed. The codes has been optimized to allow the simulation of large models (number of elements > 10 millions), the length scale of specimens can be up to tens centimeters as a mesoscale model with element sizes of 10~100 microns.\n' +
	  '&nbsp;<br>' + 
      '<br/>Collaborating with experimentalists from the University of Maine, this model has proved its capability in accurately simulating the orthotropic nature, as well as the annual ring-oriented fracture behaviors of wood materials. This model can elucidate mesoscale-level understanding on how the cellular morphology influences the macroscopic properties of the material. This insight can be harnessed for the design of natural and engineered "wood-like" materials with special functionalities, such as anisotropic programmable material properties, stress redirection, and oriented impact energy dissipation.',
    list: [
      {
        type:'md',
        file: "morphology", ///content目录下需要访问的md文件
        title: "Modeling of wood mesostructure", //列表中展示的标题

        img: "/Pine_cs.jpg", // 列表封面：static/webGl/img目录下图片的路径
      },
      {
        type:'md',
        file: "IGAbeam", ///content目录下需要访问的md文件
        title:
          "Isogeometric beam lattice", //列表中展示的标题

        img: "/beam.png", // 列表封面：static/webGl/img目录下图片的路径
      },
      {
        type:'md',
        file: "cbl", ///content目录下需要访问的md文件
        title:
          "Connector-beam lattice model for wood", //列表中展示的标题

        img: "/cbl.gif", // 列表封面：static/webGl/img目录下图片的路径
      },
    ]
  },


  {
    category: 'Computational multimodel framework for coupled hygro-thermo-mechanical analyses of lattice systems',
    desc: 'The mechanical behaviors of porous materials, particularly their susceptibility to cracking, can be influenced by various chemical and physical phenomena. Changes in environmental conditions can have opposing effects on different materials: for example, rise in temperature makes porous materials either stronger and more brittle (e.g., early-age concrete) or weaker and more ductile (e.g., wood and composites) within a typical application temperature range. Likewise, variations in moisture content or temperature can cause volumetric changes that, when restrained, lead to the development of stress within the material. In addition to mechanical loading, hygral or thermal effects may also contribute to crack initiation and propagation. Consequently, the durability of materials is often affected by a combination of mechanical, hygral, and/or thermal processes, which typically commence at production stages and evolve over the life cycle of the material. Therefore, for many applications, fracture analysis should be modeled under a multiphysics context.' +
      '&nbsp;<br/>' + 
	  '<br/>This research proposes a newly developed computational pipeline for coupled multiphysics and fracture analyses of topologically dual lattice systems for porous materials, through the Inter-Process Communication (IPC) between mechanical and flow/transport solvers, with a particular emphasis on the mesoscale hygro-thermo-mechanical modeling of wood and concrete.',
    list: [
      {
        type:'md',
        file: "dual", ///content目录下需要访问的md文件
        title:
          "Topologically dual systems of lattice models", //列表中展示的标题

        img: "/MLDPM.png", // 列表封面：static/webGl/img目录下图片的路径
      },
      {
        type:'md',
        file: "flow", ///content目录下需要访问的md文件
        title:
          "Discrete models for transport phenomena", //列表中展示的标题

        img: "/discreteflow.png", // 列表封面：static/webGl/img目录下图片的路径
      },
      {
        type:'md',
        file: "coupling", ///content目录下需要访问的md文件
        title:
          "Multiphysics in lattice models", //列表中展示的标题

        img: "/poro.gif", // 列表封面：static/webGl/img目录下图片的路径
      },
    ]
  },


  {
    category: 'Some previous fun projects',
    desc: 'Here is a little gallery of my previous projects during undergrad and grad school time',
    list: [
      {
        file: "normal_mapping/Normal.html", ///static/webgl目录下需要访问的html文件
        title:
          "Computer graphics: texture mapping", //列表中展示的标题

        img: "/2.gif", // 列表封面：static/webGl/img目录下图片的路径
      },
      {
        file: "shading/Teapot.html", ///static/webgl目录下需要访问的html文件
        title: "Computer graphics: environment mapping", //列表中展示的标题

        img: "/1.gif", // 列表封面：static/webGl/img目录下图片的路径
      },
      {
        file: "terrain/Flight.html", ///static/webgl目录下需要访问的html文件
        title:
          "Computer graphics: terrain generation", //列表中展示的标题

        img: "/3.gif", // 列表封面：static/webGl/img目录下图片的路径
      },


      {
        file: "to.pdf", ///static/webgl目录下需要访问的html文件
        title:
          "Finite element: topology optimization", //列表中展示的标题

        img: "/to.gif", // 列表封面：static/webGl/img目录下图片的路径
      },
      {
        file: "arclength.pdf", ///static/webgl目录下需要访问的html文件
        title:
          "Finite element: arc-length method", //列表中展示的标题

        img: "/arclength.gif", // 列表封面：static/webGl/img目录下图片的路径
      },

      {
        type:'md',
        file: "rail", ///content目录下需要访问的md文件
        title:
          "Finite element: dynamic analysis of rail joints", //列表中展示的标题

        img: "/rail.gif", // 列表封面：static/webGl/img目录下图片的路径
      },


      {
        file: "transport.pdf", ///static/webgl目录下需要访问的html文件
        title:
          "Fluid dynamics: viscous scalar transport", //列表中展示的标题

        img: "/transport.gif", // 列表封面：static/webGl/img目录下图片的路径
      },
      {
        file: "cavityflow.pdf", ///static/webgl目录下需要访问的html文件
        title:
          "Fluid dynamics: lid-driven square cavity flow", //列表中展示的标题

        img: "/cavityflow.png", // 列表封面：static/webGl/img目录下图片的路径
      },
      {
        file: "vortices.pdf", ///static/webgl目录下需要访问的html文件
        title:
          "Fluid dynamics: Von Karman vortices", //列表中展示的标题

        img: "/vortices.gif", // 列表封面：static/webGl/img目录下图片的路径
      },


      {
        file: "shell.pdf", ///static/webgl目录下需要访问的html文件
        title:
          "Structure analysis: plates & shells", //列表中展示的标题

        img: "/shell.png", // 列表封面：static/webGl/img目录下图片的路径
      },
      {
        file: "stability.pdf", ///static/webgl目录下需要访问的html文件
        title:
          "Structure analysis: stability analysis", //列表中展示的标题

        img: "/stability.png", // 列表封面：static/webGl/img目录下图片的路径
      },
      {
        file: "fracture.pdf", ///static/webgl目录下需要访问的html文件
        title:
          "Structure analysis: fracture mechanics", //列表中展示的标题

        img: "/fracture.png", // 列表封面：static/webGl/img目录下图片的路径
      },
    ]
  },
];
