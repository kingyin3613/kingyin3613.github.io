export default {
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Hao Yin - Personal Website',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
	  { name: 'keywords', content: 'Hao Yin, Yin Hao, 银皓, Northwestern University, Research' },
      { name: 'description', content: 'Hao Yin (银皓)- personal research website. Hao Yin is a Ph.D. candidate of Civil Engineering working in the Multiscale Mechanics of Infrastructure Materials (M2IM) Lab at Northwestern University. He is currently completing his Ph.D. thesis, under the supervision of Dr. Gianluca Cusatis, focusing on the development of a novel computational framework for thermo-hygro-mechanical analyses of complex lattice systems (e.g., wood microstructure, bio-inspired composites). His research interests include lattice/discrete models, bio-inspired materials, fracture mechanics, multiphysics, and generative geometry..' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [

      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/main.css' },
      { rel: 'stylesheet', href: '/font.css' }

    ],
    script: [
      // {
      //   type: 'text/javascript',
      //   src: '//cdn.bootcss.com/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
      //   body: true //<script>是否在body中
      // },

    ]


  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~pages/css/md.less'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/mathjs', ssr: false },

  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
