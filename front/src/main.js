import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import VueNativeSock from 'vue-native-websocket'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'prismjs'
import 'prismjs/components/prism-python'

// remove prod tip from console
Vue.config.productionTip = false

// Bootstrap plugin
Vue.use(BootstrapVue)

// HTTP plugin
Vue.use(VueResource)

// WebSocket
const options = {
  store,
  format: 'json',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
}
Vue.use(VueNativeSock, process.env.VUE_APP_WEBSOCKET_URL, options)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
