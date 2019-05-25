import http from './http'

const manifestUrl = http.getApiUrl() + 'manifest/'

export default {

  async create (manifest) {
    return http.post(manifestUrl, manifest)
  },

  async update (id, content) {
    return http.put(manifestUrl + id, { content })
  },

  async list () {
    return http.get(manifestUrl)
  },

  async get (id) {
    return http.get(manifestUrl + id)
  }
}
