import Vue from 'vue'

async function handleError (request) {
  try {
    return await request
  } catch (err) {
    const body = {}
    if (err.status === 0) {
      body.message = 'Connection refused, server unreachable'
    } else {
      body.message = err.body.message
    }
    err.body = body

    throw err
  }
}

export default {
  getApiUrl () {
    const protocol = process.env.VUE_APP_API_PROTOCOL
    const host = process.env.VUE_APP_API_HOST
    const port = process.env.VUE_APP_API_PORT

    return `${protocol}://${host}:${port}/api/`
  },

  get (url, options) {
    return handleError(Vue.http.get(url, options))
  },

  post (url, options) {
    return handleError(Vue.http.post(url, options))
  },

  put (url, options) {
    return handleError(Vue.http.put(url, options))
  },

  delete (url, options) {
    return handleError(Vue.http.delete(url, options))
  }
}
