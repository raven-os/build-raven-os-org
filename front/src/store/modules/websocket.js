import * as types from '../mutation-types'
import Vue from 'vue'

const state = {
  socket: {
    isConnected: false,
    message: '',
    reconnectError: false
  }
}

const getters = {
}

const actions = {
}

const mutations = {
  [types.SOCKET_ONOPEN] (state, event) {
    Vue.set(state.socket, 'isConnected', true)
    console.log('[SOCKET_ONOPEN]', event)
  },

  [types.SOCKET_ONCLOSE] (state, event) {
    console.log('[SOCKET_ONCLOSE]', event)
  },

  [types.SOCKET_ONERROR] (state, event) {
    console.log('[SOCKET_ONERROR]', event)
  },

  // default handler called for all methods
  [types.SOCKET_ONMESSAGE] (state, message) {
    console.log('[SOCKET_ONMESSAGE]', message)
  },

  // mutations for reconnect methods
  [types.SOCKET_RECONNECT] (state, count) {
    console.info('[SOCKET_RECONNECT]', state, count)
  },

  [types.SOCKET_RECONNECT_ERROR] (state) {
    console.log('[SOCKET_RECONNECT_ERROR]')
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
