import http from './http'

const authUrl = http.getApiUrl() + 'auth/'

export default {

  async login (email, password) {
    return http.post(`${authUrl}login`, { email, password })
  },

  async logout () {
    return http.delete(`${authUrl}logout`)
  }
}
