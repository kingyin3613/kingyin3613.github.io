// 论文目录
/**
 *  论文中静态资源放到static下 (YH: 单击名字指向外部链接/加粗名字/加星号)
 *  type:默认调用content下md文件；pdf——static/pdf/下文件 ；link——外部访问链接
 */
export default [
    {
        type: 'pdf', //(YH:这里可否直接指向外部网址？)
        file: '15', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径 link：外部链接

        title: 'Generative conforming delaunay graph for the discrete modeling of intercellular flow',//列表中展示的标题
        author: '<b>Hao Yin</b>, Gianluca Cusatis', // 作者
        desc: '15-conforming',// 描述
        img: '/assets/15.png',// 列表封面：static目录下图片的路径
        date: '2025',// 发表日期
        publisher: 'In preparation', // 出版商
        topic:'Generative Geometry'
    },
	
    {
        type: 'pdf', //(YH:这里可否直接指向外部网址？)
        file: '14', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径 link：外部链接

        title: 'High-fidelity method for mesoscopic rheology of fresh fiber-reinforced concrete based on sph-dem',//列表中展示的标题
        author: 'Cheng Huang, Lei Shen, Wenyan Yu, Nizar Faisal Alkayem, Zhenghong Tian, <b>Hao Yin</b>, Gianluca Cusatis', // 作者
        desc: '14-rheology',// 描述
        img: '/assets/14.png',// 列表封面：static目录下图片的路径
        date: '2024',// 发表日期
        publisher: 'Under review', // 出版商
        topic:'Lattice Models'
    },
	
    {
        type: 'pdf', //(YH:这里可否直接指向外部网址？)
        file: '13', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径 link：外部链接

        title: 'An interprocess communication-based two-way coupling approach for implicit-explicit multiphysics lattice discrete particle model simulations',//列表中展示的标题
        author: '<b>Hao Yin</b>, Matthew Treomner, Weixin Li, Erol Lale, Lifu Yang, Lei Shen, Mohammed Alnaggar, Giovanni Di Luzio, Gianluca Cusatis', // 作者
        desc: '13-coupling',// 描述
        img: '/assets/13.png',// 列表封面：static目录下图片的路径
        date: '2024',// 发表日期
        publisher: 'Engineering Fracture Mechanics', // 出版商
        topic:'Multiphysics'

    },
	
    {
        // type: 'pdf', //(YH:这里可否直接指向外部网址？)
        file: 'cbl', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径 link：外部链接

        title: 'Connector-beam lattice model for wood: from micromorphology simulation to macroscopic behaviors prediction',//列表中展示的标题
        author: '<b>Hao Yin</b>, Eric Landis, Gianluca Cusatis', // 作者
        desc: '11-CBL-W',// 描述
        img: '/assets/11.png',// 列表封面：static目录下图片的路径
        date: '2024',// 发表日期
        publisher: 'In preparation', // 出版商
        topic:'Lattice Models'

    },

    {
        type: 'link',
        file: '//joss.theoj.org/papers/10.21105/joss.04945', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'RingsPy: a python package for voronoi mesh generation of cellular solids with radial growth pattern',//列表中展示的标题
        author: '<b>Hao Yin</b>, Gianluca Cusatis', // 作者
        desc: '10-ringspy',// 描述
        img: '/assets/10.gif',// 列表封面：static目录下图片的路径
        date: '2023',// 发表日期
        publisher: 'Journal of Open Source Software', // 出版商
        topic:'Generative Geometry'

    },
	
    {
        type: 'link',
        file: '//assets.researchsquare.com/files/rs-2159913/v1_covered.pdf?c=1666018675', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'Orthotropic hygroscopic behavior of mass timber: theory, computation, and experimental validation',//列表中展示的标题
        author: 'Danyang Tong, Susan Alexis Brown, <b>Hao Yin</b>, David Corr, Eric Landis, Giovanni Di Luzio, Gianluca Cusatis', // 作者
        desc: '12-woodHT',// 描述
        img: '/assets/12.jpg',// 列表封面：static目录下图片的路径
        date: '2023',// 发表日期
        publisher: 'Materials and Structures', // 出版商
        topic:'Multiphysics'

    },

    {
        type: 'pdf',
        file: '9', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'Flow lattice model for the simulation of chemistry dependent transport phenomena in cementitious materials',//列表中展示的标题
        author: '<b>Hao Yin</b>, Antonio Cibelli, Susan Alexis Brown, Lifu Yang, Lei Shen, Mohammed Alnaggar, Gianluca Cusatis, Giovanni Di Luzio', // 作者
        desc: '9-HTC-edge',// 描述
        img: '/assets/9.png',// 列表封面：static目录下图片的路径
        date: '2023',// 发表日期
        publisher: 'European Journal of Environmental and Civil Engineering', // 出版商
        topic:'Multiphysics'

    },
	
    {
        type: 'link',
        file: '//arxiv.org/pdf/2209.01420.pdf', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'Homogenization of discrete diffusion models by asymptotic expansion',//列表中展示的标题
        author: 'Jan Eliáš, <b>Hao Yin</b>, Gianluca Cusatis', // 作者
        desc: '8-Homogenization',// 描述
        img: '/assets/8.png',// 列表封面：static目录下图片的路径
        date: '2022',// 发表日期
        publisher: 'International Journal for Numerical and Analytical Methods in Geomechanics', // 出版商
        topic:'Multiphysics'
    },

    {
        type: 'link',
        file: '//www.sciencedirect.com/science/article/abs/pii/S002074032200501X', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'Mesoscopic discrete modeling of multiaxial load-induced thermal strain of concrete at high temperature',//列表中展示的标题
        author: 'Lei Shen, Huayi Zhang, Giovanni Di Luzio, <b>Hao Yin</b>, Lifu Yang, Gianluca Cusatis', // 作者
        desc: '7-LDPM-high-temp',// 描述
        img: '/assets/7.jpg',// 列表封面：static目录下图片的路径
        date: '2022',// 发表日期
        publisher: 'International Journal of Mechanical Sciences', // 出版商
        topic:'Lattice Models',

    },

    {
        type: 'pdf',
        file: '6', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'Generalized formulation for the behavior of geometrically curved and twisted three-dimensional timoshenko beams and its isogeometric analysis implementation',//列表中展示的标题
        author: '<b>Hao Yin</b>, Erol Lale, Gianluca Cusatis', // 作者
        desc: '6-IGA-beam',// 描述
        img: '/assets/6.png',// 列表封面：static目录下图片的路径
        date: '2022',// 发表日期
        publisher: 'ASME Journal of Applied Mechanics', // 出版商
		topic:'Lattice Models',

    },
	
    {
        type: 'link',
        file: '//www.sciencedirect.com/science/article/abs/pii/S2352710221007257', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'Performance of alkali-activated cementitious composite mortar used for insulating walls',//列表中展示的标题
        author: 'Chongyang Wang, Hongtao Peng, Libo Bian, <b>Hao Yin</b>, Massoud Sofi, Zihao Song, Zhiyuan Zhou', // 作者
        desc: '5-insulating-mortar',// 描述
        img: '/assets/5.jpg',// 列表封面：static目录下图片的路径
        date: '2021',// 发表日期
        publisher: 'Journal of Building Engineering', // 出版商

    },
	
    {
        type: 'link',
        file: '//journals.sagepub.com/doi/abs/10.1177/0954409718805274?journalCode=pifa', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'Numerical and experimental analysis of single tie push tests on different shapes of concrete sleepers in ballasted tracks',//列表中展示的标题
        author: 'Guoqing Jing, Peyman Aela, Hao Fu, <b>Hao Yin</b>', // 作者
        desc: '4-DEM-sleepers',// 描述
        img: '/assets/4.png',// 列表封面：static目录下图片的路径
        date: '2019',// 发表日期
        publisher: 'Journal of Rail and Rapid Transit', // 出版商

    },
	
    {
        type: 'pdf',
        file: '3', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'Investigation of relationship between train speed and bolted rail joint fatigue life using finite element analysis',//列表中展示的标题
        author: '<b>Hao Yin</b>, Yu Qian, J. Riley Edwards, Kaijun Zhu', // 作者
        desc: '3-FEM-railjoint',// 描述
        img: '/assets/3.gif',// 列表封面：static目录下图片的路径
        date: '2018',// 发表日期
        publisher: 'Transportation Research Record', // 出版商

    },

    {
        type: 'pdf',
        file: '2', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'Ballast flight risk assessment based on reliability theory',//列表中展示的标题
        author: 'Shuai Shao, Guoqing Jing, <b>Hao Yin</b>', // 作者
        desc: '2-Ballast-flight',// 描述
        img: '/assets/2.png',// 列表封面：static目录下图片的路径
        date: '2016',// 发表日期
        publisher: 'International Journal of Simulation Systems, Science & Technology', // 出版商

    },
	
    {
        type: 'link',
        file: '//www.sciencedirect.com/science/article/abs/pii/S0263224114005594', //这里可否直接指向外部网址？

        title: 'Analysis of ballast direct shear tests by discrete element method under different normal stress',//列表中展示的标题
        author: 'Zijie Wang, Guoqing Jing, Qifan Yu, <b>Hao Yin</b>', // 作者
        desc: '1-DEM-direct-shear-tests',// 描述
        img: '/assets/1.gif',// 列表封面：static目录下图片的路径
        date: '2015',// 发表日期
        publisher: 'Measurement', // 出版商

    },
]