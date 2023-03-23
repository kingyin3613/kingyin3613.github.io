// 论文目录
/**
 *  论文中静态资源放到static下
 */
export default [

    {
        type: 'pdf', //加link
        file: 'EMI2022_Yin_220601', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径 link 为相对路径资源
      
        title: 'Connector-beam lattice model (ASCE-EMI 22)',//列表中展示的标题

        img: '/assets/EMI2022_Yin_220601.png',// 列表封面：static目录下图片的路径
        date:'Jun 01, 2022',
        address:'Baltimore, MD'
    },

    {
        type: 'pdf', //加link
        file: 'NUGroup_Yin_210510', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'Coupling between Abaqus solvers',//列表中展示的标题

        img: '/assets/NUGroup_Yin_210510.png',// 列表封面：static目录下图片的路径
        date:'May 10, 2021',
        address:'Remote'
    },

    {
        type: 'pdf', //加link
        file: 'NUGroup_Yin_190917', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'Generalized Timoshenko beam theory',//列表中展示的标题

        img: '/assets/NUGroup_Yin_190917.png',// 列表封面：static目录下图片的路径
        date:'Oct 18, 2019',
        address:'Evanston, IL'
    },
	
]