import * as types from '../mutation-types'
import authApi from '../api/auth'
import Vue from 'vue'

const state = {
  user: {
    id: null
  },
  loading: {
    login: false
  },
  error: {
    login: null
  }
}

const getters = {
  getAuthUser: state => state.user,
  getAuthLoadings: state => state.loading,
  getAuthErrors: state => state.error
}

const actions = {
  async login (store, { email, password }) {
    try {
      store.commit(types.AUTH_LOGIN_REQUEST)
      const res = await authApi.login(email, password)
      store.commit(types.AUTH_LOGIN_SUCCESS, res.body)
    } catch (err) {
      store.commit(types.AUTH_LOGIN_ERROR, err.body)
    }
  }
}

const mutations = {
  [types.AUTH_LOGIN_REQUEST] (state) {
    Vue.set(state.loading, 'login', true)
    Vue.set(state.error, 'login', null)
  },

  [types.AUTH_LOGIN_SUCCESS] (state, user) {
    Vue.set(state.loading, 'login', false)
    Vue.set(state, 'user', user)
  },

  [types.AUTH_LOGIN_ERROR] (state, error) {
    Vue.set(state.loading, 'login', false)
    Vue.set(state.error, 'login', error)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
