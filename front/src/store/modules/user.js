import * as types from '../mutation-types'
import userApi from '../api/user'
import Vue from 'vue'

const state = {
  list: [],
  loading: {
    create: false,
    list: false
  },
  error: {
    create: null,
    list: null
  }
}

const getters = {
  getUserLoadings: state => state.loading,
  getUserErrors: state => state.error,
  getUserList: state => state.list
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
  },

  async list (store, search) {
    try {
      store.commit(types.USER_LIST_REQUEST)
      const res = await userApi.list(search)
      store.commit(types.USER_LIST_SUCCESS, res.body)
      return res.body
    } catch (err) {
      store.commit(types.USER_LIST_ERROR, err.body)
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

  [types.USER_CREATE_ERROR] (state, { message }) {
    Vue.set(state.loading, 'create', false)
    Vue.set(state.error, 'create', message)
  },

  [types.USER_LIST_REQUEST] (state) {
    Vue.set(state.loading, 'list', true)
    Vue.set(state.error, 'list', null)
  },

  [types.USER_LIST_SUCCESS] (state, res) {
    Vue.set(state.loading, 'list', false)
    Vue.set(state, 'list', res)
  },

  [types.USER_LIST_ERROR] (state, { message }) {
    Vue.set(state.loading, 'list', false)
    Vue.set(state.error, 'list', message)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
