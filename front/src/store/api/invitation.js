import http from './http'

const invitationUrl = http.getApiUrl() + 'invite/'

export default {

  async create (invitation) {
    return http.post(invitationUrl, invitation)
  }
}
