import http from './http'

const userUrl = http.getApiUrl() + 'user/'

export default {

  async create (user) {
    return http.post(userUrl, user)
  },

  async list (search) {
    return http.get(userUrl, { params: { search } })
  }
}
