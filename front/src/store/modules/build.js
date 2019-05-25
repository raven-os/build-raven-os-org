import * as types from '../mutation-types'
import buildApi from '../api/build'
import Vue from 'vue'

const state = {
  loading: {
    create: false,
    list: false,
    get: false
  },
  error: {
    create: null,
    list: null,
    get: null
  },
  builds: {}
}

const getters = {
  getBuildLoadings: state => state.loading,
  getBuildErrors: state => state.error,
  getBuilds: state => state.builds,
  getBuild: state => id => state.build[id] || {}
}

const actions = {
  async createBuild (store, manifestIds) {
    try {
      store.commit(types.BUILD_CREATE_REQUEST)
      const res = await buildApi.create(manifestIds)
      store.commit(types.BUILD_CREATE_SUCCESS, res.body)
    } catch (err) {
      store.commit(types.BUILD_CREATE_ERROR, err.body)
    }
  },

  async listBuilds (store) {
    try {
      store.commit(types.BUILD_LIST_REQUEST)
      const res = await buildApi.list()
      store.commit(types.BUILD_LIST_SUCCESS, res.body.data)
    } catch (err) {
      store.commit(types.BUILD_LIST_ERROR, err.body)
    }
  },

  async getBuild (store, id) {
    try {
      store.commit(types.BUILD_GET_REQUEST)
      const res = await buildApi.get(id)
      store.commit(types.BUILD_GET_SUCCESS, res.body)
    } catch (err) {
      store.commit(types.BUILD_GET_ERROR, err.body)
    }
  }
}

const mutations = {
  [types.BUILD_CREATE_REQUEST] (state) {
    Vue.set(state.loading, 'create', true)
    Vue.set(state.error, 'create', null)
  },

  [types.BUILD_CREATE_SUCCESS] (state, build) {
    Vue.set(state.loading, 'create', false)
    Vue.set(state.builds, build.id, build)
  },

  [types.BUILD_CREATE_ERROR] (state, error) {
    Vue.set(state.loading, 'create', false)
    Vue.set(state.error, 'create', error)
  },

  [types.BUILD_LIST_REQUEST] (state) {
    Vue.set(state.loading, 'list', true)
    Vue.set(state.error, 'list', null)
  },

  [types.BUILD_LIST_SUCCESS] (state, builds) {
    Vue.set(state.loading, 'list', false)
    for (let build of builds) {
      Vue.set(state.builds, build.id, build)
    }
  },

  [types.BUILD_LIST_ERROR] (state, error) {
    Vue.set(state.loading, 'list', false)
    Vue.set(state.error, 'list', error)
  },

  [types.BUILD_GET_REQUEST] (state) {
    Vue.set(state.loading, 'get', true)
    Vue.set(state.error, 'get', null)
  },

  [types.BUILD_GET_SUCCESS] (state, build) {
    Vue.set(state.loading, 'get', false)
    Vue.set(state.builds, build.id, build)
  },

  [types.BUILD_GET_ERROR] (state, error) {
    Vue.set(state.loading, 'get', false)
    Vue.set(state.error, 'get', error)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
