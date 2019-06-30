import http from './http'

const buildUrl = http.getApiUrl() + 'build/'

export default {

  async create (manifestIds) {
    return http.post(buildUrl, { ids: manifestIds })
  },

  async list (params) {
    return http.get(buildUrl, { params })
  },

  async get (id) {
    return http.get(buildUrl + id)
  }
}
