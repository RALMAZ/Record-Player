import Vue from 'vue'

// const bugsnag = require('@bugsnag/js')
// const bugsnagVue = require('@bugsnag/plugin-vue')
// const bug = bugsnag('7748ebd1125f0a74119fe7fad58d256e')
// bug.use(bugsnagVue, Vue)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

import App from './App'

new Vue({
  components: { App },
  template: '<App/>',
  // bug
}).$mount('#app')
