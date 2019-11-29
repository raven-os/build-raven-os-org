<template>
  <div id="app">
    <section id="section-login">
      <b-container>
        <h1>Login</h1>
        <div class="login-zone">
          <form @submit.prevent="loginHandler()">
            <b-container>
              <b-row class="m-2">
                <b-col>
                  <b-input-group class="custom-input-group">
                    <b-input-group-prepend class="custom-input-group-prepend">
                      Email
                    </b-input-group-prepend>
                    <input
                      v-model="email"
                      class="form-control custom-input"
                      type="email"
                      placeholder="Email"
                      autocomplete="email"
                    >
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="m-2">
                <b-col>
                  <b-input-group class="custom-input-group">
                    <b-input-group-prepend class="custom-input-group-prepend">
                      Password
                    </b-input-group-prepend>
                    <input
                      v-model="password"
                      class="form-control custom-input"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                    >
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row>
                <button class="custom-button" type="submit">
                  Login
                </button>
              </b-row>
              <b-row>
                <b-col>
                  <div class="text-center my-4">
                    <a href="/recovery" class="forgotten-pwd">Forgotten password?</a>
                  </div>
                </b-col>
              </b-row>
            </b-container>
          </form>
        </div>
      </b-container>
    </section>

    <!-- error handling -->
    <div v-if="getAuthLoadings.login" class="text-loading">
      Loging in...
    </div>
    <div v-if="error || getAuthErrors.login" class="text-error">
      <p>An error occurred while loging in</p>
      <p>{{ error || getAuthErrors.login }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      error: null,
      email: null,
      password: null
    }
  },
  computed: {
    ...mapGetters('auth', ['getAuthLoadings', 'getAuthErrors'])
  },
  mounted () {
    if (document.cookie && document.cookie.indexOf('user_sid=') !== -1) {
      this.$router.push({ path: '/builds' })
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    loginHandler () {
      this.error = null

      if (!this.email || !this.password) {
        this.error = 'You must complete all fields.'
        return
      }
      this.login({ email: this.email, password: this.password }).then(() => {
        if (!this.getAuthErrors.login) {
          this.$router.push({ path: '/builds' })
        }
      })
    }
  }
}
</script>

<style scoped>

/* SECTION LOGIN
----------------------------------- */

#section-login {
  margin-top: 200px;
}

.login-zone {
  margin-top: 75px;
  margin-bottom: 100px;
}

.forgotten-pwd {
  color: var(--accent) !important;
  text-align: center;
  display: inline-block;
}
</style>
