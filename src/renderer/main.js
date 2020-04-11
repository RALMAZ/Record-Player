import Vue from 'vue'

Vue.config.productionTip = false

import App from './App'

new Vue({
  components: { App },
  template: '<App/>',
}).$mount('#app')
