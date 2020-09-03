import Vue from 'vue'
import vClickOutside from 'v-click-outside'

import '~/assets/argon/vendor/nucleo/css/nucleo.css'
import '~/assets/argon/vendor/font-awesome/css/font-awesome.css'
import '~/assets/argon/scss/argon.scss'

import '~/assets/argon/scss/bvFill.scss'
import '~/assets/argon/scss/my-shit.scss'

import VueLazyload from 'vue-lazyload'
import globalComponents from './globalComponents'
import globalDirectives from './globalDirectives'

Vue.use(globalComponents)
Vue.use(globalDirectives)
Vue.use(VueLazyload)
// Replace custom click-outside directive with vClickOutside (IOS fix)
Vue.use(vClickOutside)
