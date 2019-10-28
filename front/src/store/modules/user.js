import * as types from '../mutation-types'
import userApi from '../api/user'
import Vue from 'vue'

const state = {
  loading: {
    create: false
  },
  error: {
    create: null
  }
}

const getters = {
  getUserLoadings: state => state.loading,
  getUserErrors: state => state.error
}

const actions = {
  async create (store, user) {
    try {
      store.commit(types.USER_CREATE_REQUEST)
      const res = await userApi.create(user)
      store.commit(types.USER_CREATE_SUCCESS)
      return res.body
    } catch (err) {
      store.commit(types.USER_CREATE_ERROR, err.body)
    }
  }
}

const mutations = {
  [types.USER_CREATE_REQUEST] (state) {
    Vue.set(state.loading, 'create', true)
    Vue.set(state.error, 'create', null)
  },

  [types.USER_CREATE_SUCCESS] (state) {
    Vue.set(state.loading, 'create', false)
  },

  [types.USER_CREATE_ERROR] (state, error) {
    Vue.set(state.loading, 'create', false)
    Vue.set(state.error, 'create', error)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
