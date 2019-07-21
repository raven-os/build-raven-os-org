import Vue from 'vue'

async function handleError (request) {
  try {
    return await request
  } catch (err) {
    const body = {}
    if (err.status === 0) {
      body.message = 'Connection refused, server unreachable'
    }
    err.body = body
    throw err
  }
}

export default {
  getApiUrl () {
    const apiUrl = process.env.VUE_APP_BASE_URL

    return apiUrl + (apiUrl.endsWith('/') ? '' : '/')
  },

  get (url, options) {
    return handleError(Vue.http.get(url, options))
  },

  post (url, options) {
    return handleError(Vue.http.post(url, options))
  },

  put (url, options) {
    return handleError(Vue.http.put(url, options))
  }
}
