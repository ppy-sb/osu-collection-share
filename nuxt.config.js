// eslint-disable-next-line nuxt/no-cjs-in-config
import webpack from 'webpack'
// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  vue: {
    config: {
      performance: process.env.NODE_ENV !== 'production'
    }
  },
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
    { src: '~/plugins/vue-fullscreen.js', mode: 'client' },
    '~/plugins/vue-flag.js',
    // '~/plugins/moment.js'
    '~/plugins/i18n-connect-dayjs.js'
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
    ['nuxt-i18n', {
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected',
        onlyOnRoot: true // recommended
      }
    }],
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
    '@nuxtjs/proxy',
    'cookie-universal-nuxt',
    '@nuxtjs/auth-next',
    'nuxt-clipboard2',
    // '@nuxtjs/pwa'
    '@nuxtjs/dayjs'
  ],
  dayjs: {
    locales: ['zh-cn', 'en-gb'],
    plugins: [
      'relativeTime'
    ]
  },
  i18n: {
    locales: [
      { code: 'gb', flag: 'gb', dayjs: 'en-gb', iso: 'en-GB', file: 'en-GB.json', dir: 'ltr', name: 'English - International' },
      { code: 'us', flag: 'us', dayjs: 'en', iso: 'en-US', file: 'en-US.json', dir: 'ltr', name: 'English - US' },
      { code: 'cn', flag: 'cn', dayjs: 'zh-cn', iso: 'zh-CN', file: 'zh-CN.json', dir: 'ltr', name: '中文 - 中国' }
    ],
    defaultLocale: 'gb',
    langDir: 'locales/',
    lazy: true,
    strategy: 'prefix_and_default',
    vueI18n: {
      fallbackLocale: 'gb'
    }
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: '/'
    }
  },
  privateRuntimeConfig: {
    axios: {
      baseURL: `http://localhost:${process.env.PORT || 3000}`
    }
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: '/'
  },
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
    extend (config, { isDev, isClient }) {
      // Web Worker support
      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
        exclude: /(node_modules)/
      })
      config.node = {
        fs: 'empty'
      }
      config.resolve.alias.vue = 'vue/dist/vue.common'
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      })
    ]
  },
  srcDir: 'client/',

  telemetry: false,

  loading: {
    color: 'white',
    height: '2px'
  },

  proxy: {
    // see Proxy section
    '/api': process.env.API_SCHEME?.startsWith('unix')
      ? {
        changeOrigin: false,
        target: { socketPath: process.env.API_LISTEN }
      }
      : {
        changeOrigin: false,
        target: `${process.env.API_SCHEME}${process.env.API_DOMAIN}:${process.env.API_LISTEN}`
      }
  },
  server: {
    host: '0' // default: localhost
  }

  // router: {
  //   extendRoutes (routes, resolve) {
  //     routes.push({
  //       name: 'help-md',
  //       path: '/help/*',
  //       component: resolve(__dirname, 'client/pages/help/render.vue')
  //     })
  //   }
  // }
}
