<template>
  <div id="app">
    <section id="builds-search">
      <b-container>
        <h1>Login</h1>
        <div class="login-zone">
        <form @submit.prevent="loginHandler()">
          <b-container>
            <b-row class="m-2">
              <b-col>
                <b-input-group class="search-input-group create-input-group">
                  <b-input-group-prepend>
                    <div class="input-prepend">Email</div>
                  </b-input-group-prepend>
                  <input
                    v-model="email"
                    class="form-control search-input"
                    type="email"
                    placeholder="Email"
                    autocomplete="email">
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <b-col>
                <b-input-group class="search-input-group create-input-group">
                  <b-input-group-prepend>
                    <div class="input-prepend">Password</div>
                  </b-input-group-prepend>
                  <input
                    v-model="password"
                    class="form-control search-input"
                    type="password"
                    placeholder="Password"
                    autocomplete="current-password">
                </b-input-group>
              </b-col>
            </b-row>
            <b-row>
              <button class="create-add" type="submit">Login</button>
            </b-row>
            <b-row>
              <b-col>
                <div class="text-center my-4" style="text-align: center;">
                  <a href="#" class="forgotten-pwd">Forgotten password?</a>
                </div>
              </b-col>
            </b-row>
          </b-container>
        </form>
        </div>
      </b-container>
    </section>

    <!-- error handling -->
    <div v-if="getAuthLoadings.login" class="loading">
      Loging in...
    </div>
    <div v-if="error || getAuthErrors.login" class="build-error">
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
    ...mapGetters('auth', [
      'getAuthLoadings',
      'getAuthErrors'
    ])
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

.login-zone {
  margin-top: 75px;
  margin-bottom: 100px;
}

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

/* BUILDS-SEARCH
----------------------------------- */
#builds-search {
  margin-top: 200px;
}

h1 {
  text-align: center;
  font-size: 45px;
}

.create-input-group {
  margin-bottom: 20px;
}

.input-prepend {
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  padding: 8px 28px;
  border-width: 1px 0px 1px 1px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--white);
  border-radius: 5px 0px 0px 5px;
  height: 40px;
  background: var(--accent);
  width: 150px;
  vertical-align: middle !important;
}

.create-input {
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  padding: 8px 28px;
  border-width: 1px 1px 1px 0px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--primary-dark);
  background: var(--white);
  border-radius: 0px 5px 5px 0px;
  height: 40px;
}

.create-add {
  font-size: 16px;
  padding: 8px 18px;
  border-width: 1px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--white);
  border-radius: 5px;
  height: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: var(--accent);
  width: 150px;
  display: block;
  margin: 0 auto;
}

.search-input,
.search-input:focus {
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  padding: 8px 28px;
  border: 1px solid var(--primary-dark);
  color: var(--primary-dark);
  background: var(--white);
  border-radius: 0px 5px 5px 0px;
  height: 40px;
  box-shadow: none;
}

.form-control:focus {
  border-color: var(--accent);
  box-shadow: none;
  outline: -webkit-focus-ring-color auto 0px;
}

.forgotten-pwd {
  color: var(--accent) !important;
  text-align: center;
  display: inline-block;
}

</style>
