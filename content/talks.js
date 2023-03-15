// 论文目录
/**
 *  论文中静态资源放到static下
 */
export default [

    {
        type: 'link', //加link
        file: '/pdf/2.pdf', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径 link 为相对路径资源
      
        title: 'link-test',//列表中展示的标题

        img: '/assets/EMI2022_Yin_220601.png',// 列表封面：static目录下图片的路径,
        date:'Oct 18, 2022 4:30 PM — 4:50 PM',
        address:'College station'

    },
    {
        type: 'pdf', //加link
        file: 'EMI2022_Yin_220601', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径 link 为相对路径资源
      
        title: 'ASCE-EMI 2022',//列表中展示的标题

        img: '/assets/EMI2022_Yin_220601.png',// 列表封面：static目录下图片的路径

    },

    {
        type: 'pdf', //加link
        file: 'NUGroup_Yin_210510', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'NU Group',//列表中展示的标题

        img: '/assets/NUGroup_Yin_210510.png',// 列表封面：static目录下图片的路径


    },

    {
        type: 'pdf', //加link
        file: 'NUGroup_Yin_190917', //md文档则在content目录下md文档文件名 pdf:static/pdf下的文件路径

        title: 'How to analyze a 3D curved beam',//列表中展示的标题

        img: '/assets/NUGroup_Yin_190917.png',// 列表封面：static目录下图片的路径


    },
	
]