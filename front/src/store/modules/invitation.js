import * as types from '../mutation-types'
import invitationApi from '../api/invitation'
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
  getInvitationLoadings: state => state.loading,
  getInvitationErrors: state => state.error
}

const actions = {
  async create (store, invitation) {
    try {
      store.commit(types.INVITATION_CREATE_REQUEST)
      await invitationApi.create(invitation)
      store.commit(types.INVITATION_CREATE_SUCCESS)
    } catch (err) {
      store.commit(types.INVITATION_CREATE_ERROR, err.body)
    }
  }
}

const mutations = {
  [types.INVITATION_CREATE_REQUEST] (state) {
    Vue.set(state.loading, 'create', true)
    Vue.set(state.error, 'create', null)
  },

  [types.INVITATION_CREATE_SUCCESS] (state) {
    Vue.set(state.loading, 'create', false)
  },

  [types.INVITATION_CREATE_ERROR] (state, { message }) {
    Vue.set(state.loading, 'create', false)
    Vue.set(state.error, 'create', message)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
