import * as types from '../mutation-types'
import Vue from 'vue'

const state = {
  socket: {
    isConnected: false,
    error: null,
    reconnectCount: 0
  }
}

const getters = {
  getSocket: state => state.socket || null
}

const actions = {
}

const wsAction = {
  BUILD_START: 'BUILD_START',
  BUILD_STDOUT: 'BUILD_STDOUT',
  BUILD_STDERR: 'BUILD_STDERR',
  BUILD_END: 'BUILD_END',
  BUILD_PACKAGES: 'BUILD_PACKAGES'
}

const mutations = {
  [types.SOCKET_ONOPEN] (state, event) {
    Vue.set(state.socket, 'isConnected', true)
    Vue.set(state.socket, 'error', null)
    Vue.set(state.socket, 'reconnectCount', 0)
  },

  [types.SOCKET_ONCLOSE] (state, event) {
    Vue.set(state.socket, 'isConnected', false)
  },

  [types.SOCKET_ONERROR] (state, event) {
    Vue.set(state.socket, 'isConnected', false)
    Vue.set(state.socket, 'error', 'The WebSocket lost connection')
  },

  [types.SOCKET_ONMESSAGE] (state, message) {
    switch (message.type) {
      case wsAction.BUILD_START:
      case wsAction.BUILD_STDOUT:
      case wsAction.BUILD_STDERR:
      case wsAction.BUILD_END:
      case wsAction.BUILD_PACKAGES:
        this.commit('build/' + types.BUILD_GET_SUCCESS, message.data)
        break
      default:
        console.info('[SOCKET_ONMESSAGE unknown wsAction]', message.type)
    }
  },

  [types.SOCKET_RECONNECT] (state, count) {
    Vue.set(state.socket, 'reconnectCount', count)
  },

  [types.SOCKET_RECONNECT_ERROR] (state) {
    Vue.set(state.socket, 'error', 'Error while reconnecting to WebSocket')
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
