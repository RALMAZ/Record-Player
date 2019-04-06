import Vue from 'vue'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

import App from './App'

new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
