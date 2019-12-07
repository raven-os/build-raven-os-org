<template>
  <div id="full-container">
    <!--==========================
    Header
    ============================-->
    <header id="header">
      <div class="container">
        <b-navbar class="app-navbar" toggleable="md" type="dark">
          <b-navbar-toggle target="nav_collapse" />
          <b-navbar-brand to="/">
            <img src="/img/raven_title.png">
          </b-navbar-brand>
          <b-collapse id="nav_collapse" is-nav>
            <div v-if="displayLogout" style="color: #DDDDDD;">Hi {{ getAuthUser.firstname }} {{ getAuthUser.lastname }},</div>
            <b-navbar-nav class="ml-auto">
              <!-- TODO: move this out of the navbar -->
              <b-nav-item to="/builds" exact class="nav-item" active-class="nav-item-active">
                Builds
              </b-nav-item>
              <b-nav-item to="/manifests" exact class="nav-item" active-class="nav-item-active">
                Manifests
              </b-nav-item>
              <b-nav-item to="/manifests/create" exact class="nav-item" active-class="nav-item-active">
                Create manifest
              </b-nav-item>
              <b-nav-item v-if="isAdmin" to="/admin" exact class="nav-item" active-class="nav-item-active">
                Admin
              </b-nav-item>
              <b-nav-item v-if="displayLogout" exact class="nav-item" active-class="nav-item-active">
                <a @click.prevent="handleLogout()">Logout</a>
              </b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
        <!-- #nav-menu-container -->
      </div>
    </header>
    <!-- #header -->

    <div class="content">
      <br><br>
      <!-- error handling -->
      <div v-if="getAuthLoadings.logout" class="loading">
        Loging out...
      </div>
      <div v-if="getAuthErrors.logout" class="build-error">
        <p>An error occurred while loging out</p>
        <p>{{ getAuthErrors.logout }}</p>
      </div>
      <router-view class="view" />
    </div>

    <!--==========================
    Footer
    ============================-->
    <footer id="footer">
      <div class="container py-4">
        <div class="text-center">
          &copy; Copyright <strong>Raven</strong>. All Rights Reserved
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      displayLogout: false,
      activeItem: 'home'
    }
  },
  computed: {
    ...mapGetters('auth', [
      'getAuthUser',
      'getAuthLoadings',
      'getAuthErrors'
    ]),
    isAdmin () {
      return (this.getAuthUser && this.getAuthUser.rights && this.getAuthUser.rights.includes('admin')) || false
    }
  },
  watch: {
    $route (to, from) {
      if (from.path === '/login' || this.isConnected()) {
        this.displayLogout = true
      } else if (to.path === '/login' && !this.isConnected()) {
        this.displayLogout = false
      }
    }
  },
  mounted: function () {
    if (this.isConnected()) {
      this.displayLogout = true
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    isActive: function (menuItem) {
      return this.activeItem === menuItem
    },
    setActive: function (menuItem) {
      this.activeItem = menuItem
    },
    isConnected () {
      return (document.cookie && document.cookie.indexOf('user_sid=') !== -1) || false
    },
    handleLogout () {
      this.logout().then(() => {
        if (!this.getAuthErrors.logout) {
          this.$router.push({ path: '/login' })
        }
      })
    }
  }
}
</script>

<style scoped>
.loading {
  color: var(--accent);
  font-weight: bold;
  text-align: center;
  margin-bottom: 25px;
}

.build-error {
  text-align: center;
  margin-bottom: 25px;
  color: var(--accent);
}

#full-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  flex: 1 0 auto;
  padding: 20px;
}

/* -----------------------------------
Header
----------------------------------- */

#header {
  padding: 0px 0;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  transition: all 0.5s;
  z-index: 997;
  background: var(--primary-dark);
  height: 61px;
}

.app-navbar {
  background-color: var(--primary-dark);
  /* text-transform: uppercase; */
}

.nav-item {
  color: var(--white) !important;
}

.nav-item-active {
  color: var(--white) !important;
}

/* -----------------------------------
  Footer
----------------------------------- */

#footer {
  background: var(--primary-dark);
  padding: 0px 0;
  color: var(--white);
  font-size: 14px;
  width: 100%;
  height: 72px;
}

@media (max-width: 800px) {
  #footer {
    margin-top: 50px;
  }
}
</style>
