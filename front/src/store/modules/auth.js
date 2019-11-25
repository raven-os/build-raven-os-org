import * as types from '../mutation-types'
import authApi from '../api/auth'
import Vue from 'vue'

const state = {
  user: {},
  loading: {
    login: false,
    logout: false,
    forgotPassword: false,
    resetPassword: false
  },
  error: {
    login: null,
    logout: null,
    forgotPassword: null,
    resetPassword: null
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
  },

  async forgotPassword (store, { email }) {
    try {
      store.commit(types.AUTH_FORGOT_PASSWORD_REQUEST)
      await authApi.forgotPassword(email)
      store.commit(types.AUTH_FORGOT_PASSWORD_SUCCESS)
    } catch (err) {
      store.commit(types.AUTH_FORGOT_PASSWORD_ERROR, err.body)
    }
  },

  async resetPassword (store, { token, password }) {
    try {
      store.commit(types.AUTH_RESET_PASSWORD_REQUEST)
      await authApi.resetPassword(token, password)
      store.commit(types.AUTH_RESET_PASSWORD_SUCCESS)
    } catch (err) {
      store.commit(types.AUTH_RESET_PASSWORD_ERROR, err.body)
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
  },

  [types.AUTH_FORGOT_PASSWORD_REQUEST] (state) {
    Vue.set(state.loading, 'forgotPassword', true)
    Vue.set(state.error, 'forgotPassword', null)
  },

  [types.AUTH_FORGOT_PASSWORD_SUCCESS] (state) {
    Vue.set(state.loading, 'forgotPassword', false)
  },

  [types.AUTH_FORGOT_PASSWORD_ERROR] (state, error) {
    Vue.set(state.loading, 'forgotPassword', false)
    Vue.set(state.error, 'forgotPassword', error)
  },

  [types.AUTH_RESET_PASSWORD_REQUEST] (state) {
    Vue.set(state.loading, 'resetPassword', true)
    Vue.set(state.error, 'resetPassword', null)
  },

  [types.AUTH_RESET_PASSWORD_SUCCESS] (state) {
    Vue.set(state.loading, 'resetPassword', false)
  },

  [types.AUTH_RESET_PASSWORD_ERROR] (state, error) {
    Vue.set(state.loading, 'resetPassword', false)
    Vue.set(state.error, 'resetPassword', error)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
