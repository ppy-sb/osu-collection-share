
// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700' }
    ]
  },

  /*
  ** Configuration for @nuxtjs/pwa
  ** https://developer.mozilla.org/en-US/docs/Web/Manifest
  */
  manifest: {
    name: 'Vue Argon Design',
    short_name: 'Argon Design',
    description: 'Vue Argon Design System for Nuxt',
    theme_color: '#172b4d'
  },

  meta: {
    // apple-mobile-web-app-capable=yes
    // https://medium.com/@firt/dont-use-ios-web-app-meta-tag-irresponsibly-in-your-progressive-web-apps-85d70f4438cb
    mobileAppIOS: true,
    appleStatusBarStyle: '#172b4d'
  },
  // serverMiddleware: [{ path: '/api', handler: '~/api/index.js' }],
  /*
  ** Global CSS
  */
  css: [
    '~assets/argon/vendor/nucleo/css/nucleo.css',
    '@fortawesome/fontawesome-free/css/all.css',
    '~assets/argon/scss/argon.scss',
    'bootstrap-vue/dist/bootstrap-vue.css',
    '~assets/transitions.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/argon/argon-kit',
    // { src: '~/plugins/database/index.js', mode: 'server' }
    { src: '~/plugins/debounce/index.js', mode: 'client' },
    { src: '~/plugins/vue-worker.js', mode: 'client' },
    '~/plugins/i18n.js',
    '~/plugins/vue-flag.js'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // // Doc: https://bootstrap-vue.js.org
    // 'bootstrap-vue/nuxt',
    // // Doc: https://axios.nuxtjs.org/usage
    // '@nuxtjs/axios',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    ['bootstrap-vue/nuxt', {
      bootstrapCSS: false,
      bootstrapVueCSS: false
      // componentPlugins: [
      //   'Carousel',
      //   'Spinner'
      // ],
      // directivePlugins: [
      //   'Tooltip',
      //   'Popover'
      // ]

    }],
    'nuxt-clipboard2'
    // '@nuxtjs/pwa'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
  /*
  ** Content module configuration
  ** See https://content.nuxtjs.org/configuration
  */
  content: {},
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    extend (config, ctx) {
      config.node = {
        fs: 'empty'
      }
    }
  }
}
