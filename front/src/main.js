import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import VueNativeSock from 'vue-native-websocket'
import BootstrapVue from 'bootstrap-vue'
import Paginate from 'vuejs-paginate'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'prismjs'
import 'prismjs/components/prism-python'

// remove prod tip from console
Vue.config.productionTip = false

// Bootstrap plugin
Vue.use(BootstrapVue)
// Pagination plugin
Vue.component('paginate', Paginate)

// HTTP plugin
Vue.use(VueResource)
Vue.http.options.credentials = true
Vue.http.options.xhr = { withCredentials: true }

// WebSocket
const options = {
  store,
  format: 'json',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  connectManually: true
}

const wsUrl = () => {
  const protocol = (process.env.VUE_APP_API_PROTOCOL || '').endsWith('s') ? 'wss' : 'ws'
  const host = process.env.VUE_APP_API_HOST
  const port = process.env.VUE_APP_API_PORT

  return `${protocol}://${host}:${port}/ws`
}

Vue.use(VueNativeSock, wsUrl(), options)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
