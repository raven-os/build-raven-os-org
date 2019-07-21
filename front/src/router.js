import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeBuilds from './views/build/home.vue'
import CreateBuild from './views/build/create.vue'
import DetailsBuild from './views/build/details.vue'
import HomeManifests from './views/manifest/home.vue'
import CreateManifest from './views/manifest/create.vue'
import UpdateManifest from './views/manifest/update.vue'
import DetailsManifest from './views/manifest/details.vue'

Vue.use(VueRouter)
// TODO: improve URLs
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: HomeBuilds },
    { path: '/builds/create', component: CreateBuild },
    { path: '/builds/details/:id', name: 'DetailsBuild', component: DetailsBuild, props: true },
    { path: '/manifests', component: HomeManifests },
    { path: '/manifests/create', component: CreateManifest },
    { path: '/manifests/update/:id', component: UpdateManifest, props: true },
    { path: '/manifests/details/:id', name: 'DetailsManifest', component: DetailsManifest, props: true }
  ]
})

export default router
