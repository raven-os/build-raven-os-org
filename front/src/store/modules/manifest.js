import * as types from '../mutation-types'
import manifestApi from '../api/manifest'
import Vue from 'vue'

const state = {
  loading: {
    create: false,
    update: false,
    list: false,
    get: false
  },
  error: {
    create: null,
    update: null,
    list: null,
    get: null
  },
  manifests: [],
  pagination: {
    total: 0,
    perPage: 0,
    currentPage: 0,
    pageCount: 0
  }
}

const getters = {
  getManifestLoadings: state => state.loading,
  getManifestErrors: state => state.error,
  getManifests: state => state.manifests,
  getManifest: state => id => state.manifests.find(x => x.id === id) || null,
  getManifestPagination: state => state.pagination
}

const actions = {
  async createManifest (store, { name, content }) {
    const manifest = {
      name,
      content
    }

    try {
      store.commit(types.MANIFEST_CREATE_REQUEST)
      const res = await manifestApi.create(manifest)
      store.commit(types.MANIFEST_CREATE_SUCCESS, res.body)
      return res.body
    } catch (err) {
      store.commit(types.MANIFEST_CREATE_ERROR, err.body)
    }
  },

  async updateManifest (store, { id, content }) {
    try {
      store.commit(types.MANIFEST_UPDATE_REQUEST)
      const res = await manifestApi.update(id, content)
      store.commit(types.MANIFEST_UPDATE_SUCCESS, res.body)
      return res.body
    } catch (err) {
      store.commit(types.MANIFEST_UPDATE_ERROR, err.body)
    }
  },

  async listManifests (store, params) {
    try {
      store.commit(types.MANIFEST_LIST_REQUEST)
      const res = await manifestApi.list(params)
      store.commit(types.MANIFEST_LIST_SUCCESS, res.body)
    } catch (err) {
      store.commit(types.MANIFEST_LIST_ERROR, err.body)
    }
  },

  async retrieveManifest (store, id) {
    try {
      store.commit(types.MANIFEST_GET_REQUEST)
      const res = await manifestApi.get(id)
      store.commit(types.MANIFEST_GET_SUCCESS, res.body)
    } catch (err) {
      store.commit(types.MANIFEST_GET_ERROR, err.body)
    }
  }
}

const mutations = {
  [types.MANIFEST_CREATE_REQUEST] (state) {
    Vue.set(state.loading, 'create', true)
    Vue.set(state.error, 'create', null)
  },

  [types.MANIFEST_CREATE_SUCCESS] (state, manifest) {
    Vue.set(state.loading, 'create', false)
  },

  [types.MANIFEST_CREATE_ERROR] (state, error) {
    Vue.set(state.loading, 'create', false)
    Vue.set(state.error, 'create', error)
  },

  [types.MANIFEST_UPDATE_REQUEST] (state) {
    Vue.set(state.loading, 'update', true)
    Vue.set(state.error, 'update', null)
  },

  [types.MANIFEST_UPDATE_SUCCESS] (state, manifest) {
    Vue.set(state.loading, 'update', false)
  },

  [types.MANIFEST_UPDATE_ERROR] (state, error) {
    Vue.set(state.loading, 'update', false)
    Vue.set(state.error, 'update', error)
  },

  [types.MANIFEST_LIST_REQUEST] (state) {
    Vue.set(state.loading, 'list', true)
    Vue.set(state.error, 'list', null)
  },

  [types.MANIFEST_LIST_SUCCESS] (state, res) {
    Vue.set(state.loading, 'list', false)
    Vue.set(state, 'manifests', res.data)
    Vue.set(state, 'pagination', res.meta.pagination)
  },

  [types.MANIFEST_LIST_ERROR] (state, error) {
    Vue.set(state.loading, 'list', false)
    Vue.set(state.error, 'list', error)
  },

  [types.MANIFEST_GET_REQUEST] (state) {
    Vue.set(state.loading, 'get', true)
    Vue.set(state.error, 'get', null)
  },

  [types.MANIFEST_GET_SUCCESS] (state, manifest) {
    Vue.set(state.loading, 'get', false)
    Vue.set(state, 'manifests', [manifest])
  },

  [types.MANIFEST_GET_ERROR] (state, error) {
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
