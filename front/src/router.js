import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/home.vue'
import Create from './views/create.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/create', component: Create }
  ]
})

export default router
