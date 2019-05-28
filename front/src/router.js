import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeBuilds from './views/homeBuilds.vue'
import CreateBuild from './views/createBuild.vue'
import DetailsBuild from './views/detailsBuild.vue'
import HomeManifests from './views/homeManifests.vue'
import CreateManifest from './views/createManifest.vue'
import DetailsManifest from './views/detailsManifest.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: HomeBuilds },
    { path: '/builds/create', component: CreateBuild },
    { path: '/builds/details/:id', name: 'DetailsBuild', component: DetailsBuild, props: true },
    { path: '/manifests', component: HomeManifests },
    { path: '/manifests/create', component: CreateManifest },
    { path: '/manifests/details/:id', name: 'DetailsManifest', component: DetailsManifest, props: true }
  ]
})

export default router
