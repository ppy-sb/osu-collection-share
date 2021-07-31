import Vue from 'vue'
const dayjs = {}
const dayjs = require('dayjs')
dayjs.install = function (Vue, { locale = 'en-gb' } = {}) {
  //     // 1. 添加全局方法或 property
  //     Vue.myGlobalMethod = function () {
  //         // 逻辑...
  //     }

  //     // 2. 添加全局资源
  //     Vue.directive('my-directive', {
  //         bind(el, binding, vnode, oldVnode) {
  //             // 逻辑...
  //         }
  //     ...
  //   })

  // 3. 注入组件选项
  Vue.mixin({
    beforeCreate () {
      this.$dayjs.locale((this.$root.locale || locale) || 'en-GB')
    },
    methods: {
      dayjs (...any) {
        if (this.$root.locale !== this.$dayjs.locale) { this.setLocale() }
        return this.$dayjs(...any)
      },
      setLocale () {
        this.$dayjs.locale((this.$root.locale || locale) || 'en-GB')
      }
    }
  })

  // // 4. 添加实例方法
  // Vue.prototype.$myMethod = function (methodOptions) {
  //     // 逻辑...
  // }
  Vue.prototype.$dayjs = dayjs
}

Vue.use(dayjs)
