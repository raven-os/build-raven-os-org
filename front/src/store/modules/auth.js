import * as types from '../mutation-types'
import authApi from '../api/auth'
import Vue from 'vue'

const state = {
  user: {},
  loading: {
    login: false,
    logout: false
  },
  error: {
    login: null,
    logout: null
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
  },

  async logout (store) {
    try {
      store.commit(types.AUTH_LOGOUT_REQUEST)
      await authApi.logout()
      store.commit(types.AUTH_LOGOUT_SUCCESS)
    } catch (err) {
      store.commit(types.AUTH_LOGOUT_ERROR, err.body)
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
  },

  [types.AUTH_LOGOUT_REQUEST] (state) {
    Vue.set(state.loading, 'logout', true)
    Vue.set(state.error, 'logout', null)
  },

  [types.AUTH_LOGOUT_SUCCESS] (state) {
    Vue.set(state.loading, 'logout', false)
    Vue.set(state, 'user', {})
  },

  [types.AUTH_LOGOUT_ERROR] (state, error) {
    Vue.set(state.loading, 'logout', false)
    Vue.set(state.error, 'logout', error)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
