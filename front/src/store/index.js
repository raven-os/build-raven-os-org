import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  strict: true,
  plugins: [createPersistedState({ paths: ['auth.user'] })]
})

export default store
