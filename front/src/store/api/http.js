import Vue from 'vue'

// See https://github.com/pagekit/vue-resource/blob/develop/docs/http.md

export default {
  getApiUrl () {
    const apiUrl = process.env.VUE_APP_BASE_URL

    return apiUrl + (apiUrl.endsWith('/') ? '' : '/')
  },

  get (url, options) {
    return Vue.http.get(url, options)
  },

  post (url, options) {
    return Vue.http.post(url, options)
  },

  put (url, options) {
    return Vue.http.put(url, options)
  }
}
