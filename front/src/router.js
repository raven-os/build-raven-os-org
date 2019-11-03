import Vue from 'vue'
import store from './store'
import VueRouter from 'vue-router'
import HomeBuilds from './views/build/home.vue'
import CreateBuild from './views/build/create.vue'
import DetailsBuild from './views/build/details.vue'
import HomeManifests from './views/manifest/home.vue'
import CreateManifest from './views/manifest/create.vue'
import UpdateManifest from './views/manifest/update.vue'
import DetailsManifest from './views/manifest/details.vue'
import LoginAuth from './views/auth/login.vue'
import AdminInvitation from './views/admin/invitation.vue'
import UserRegister from './views/user/register.vue'

Vue.use(VueRouter)

const isConnected = () => (document.cookie && document.cookie.indexOf('user_sid=') !== -1) || false

const connectionRequired = (to, from, next) => {
  if (isConnected()) {
    return next()
  }

  next('/login')
}

const noConnectionRequired = (to, from, next) => {
  if (!isConnected()) {
    return next()
  }

  next('/builds')
}

const adminRequired = (to, from, next) => {
  const user = store.getters['auth/getAuthUser']

  if (!isConnected()) {
    return next('/login')
  }

  if (user && user.rights && user.rights.includes('admin')) {
    return next()
  }

  next('/builds')
}

// TODO: improve URLs
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', beforeEnter: (to, from, next) => next('/builds') },
    { path: '/builds', component: HomeBuilds, beforeEnter: connectionRequired },
    { path: '/builds/create', component: CreateBuild, beforeEnter: connectionRequired },
    { path: '/builds/details/:id', name: 'DetailsBuild', component: DetailsBuild, props: true, beforeEnter: connectionRequired },
    { path: '/manifests', component: HomeManifests, beforeEnter: connectionRequired },
    { path: '/manifests/create', component: CreateManifest, beforeEnter: connectionRequired },
    { path: '/manifests/update/:id', component: UpdateManifest, props: true, beforeEnter: connectionRequired },
    { path: '/manifests/details/:id', name: 'DetailsManifest', component: DetailsManifest, props: true, beforeEnter: connectionRequired },
    { path: '/login', name: 'LoginAuth', component: LoginAuth, beforeEnter: noConnectionRequired },
    { path: '/admin', name: 'AdminInvitation', component: AdminInvitation, beforeEnter: adminRequired },
    { path: '/register', name: 'UserRegister', component: UserRegister, beforeEnter: noConnectionRequired }
  ]
})

export default router
