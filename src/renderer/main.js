import Vue from 'vue'
import Vuex from "vuex"

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

import { createPersistedState, createSharedMutations } from "vuex-electron"

Vue.use(Vuex)

var store = new Vuex.Store({
  state: {
    savedVolume: 100
  },
  mutations: {
    saveVolume(state, newVolume) {
      state.savedVolume = newVolume;
    }
  },
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ],
})

import App from './App'

new Vue({
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app')
