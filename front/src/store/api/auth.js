import http from './http'

const authUrl = http.getApiUrl() + 'auth/'

export default {

  async login (email, password) {
    return http.post(`${authUrl}login`, { email, password })
  },

  async logout () {
    return http.delete(`${authUrl}logout`)
  },

  async forgotPassword (email) {
    return http.post(`${authUrl}forgot`, { email })
  },

  async resetPassword (token, password) {
    return http.put(`${authUrl}reset`, { token, password })
  }
}
