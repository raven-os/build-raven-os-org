<template>
  <div id="app">
    <section id="builds-search">
      <b-container>
        <h1>Login</h1>
        <form @submit.prevent="loginHandler()">
          <input
            v-model="email"
            class="form-control search-input"
            type="email"
            placeholder="Email"
            autocomplete="email">
          <br>
          <br>
          <input
            v-model="password"
            class="form-control search-input"
            type="password"
            placeholder="Password"
            autocomplete="current-password">
          <br>
          <br>
          <button type="submit">Login</button>
        </form>
        <a href="#">recover password</a>
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

.current {
  font-weight: bold;
}

.pagination  {
  margin-top: 1em;
  font-size: 1.2em;
}

.pagination a {
  padding: 1em;
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

.search-zone {
  padding: 10px;
}

.search-input-group {
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

.search-select {
  font-size: 16px;
  display: inline-block;
  padding-left: 10px;
  border-width: 1px 0px 1px 1px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--white);
  border-radius: 5px 0px 0px 5px;
  height: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: var(--accent)
    url("https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_down_48px-128.png")
    no-repeat;
  background-size: 20px;
  background-position: right 10px center;
  width: 175px;
}

/* BUILDS-SORT
----------------------------------- */
.builds-sort {
  margin-bottom: 25px;
  width: 25%;
  margin-right: 0;
  margin-left: auto;
}

@media (max-width: 500px) {
  .builds-sort {
    width: 100%;
  }
}

.sort-select,
.sort-select:focus {
  font-size: 16px;
  display: inline-block;
  padding-left: 10px;
  border: 1px solid var(--accent);
  color: var(--white);
  border-radius: 5px;
  height: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: var(--light-accent)
    url("https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_down_48px-128.png")
    no-repeat;
  background-size: 20px;
  background-position: right 10px center;
  box-shadow: none;
}

/* BUILDS-LIST
----------------------------------- */
#builds-list {
  margin-top: 75px;
}

.build-item:hover i,
.build-item:hover .item-pkg {
  color: var(--white) !important;
}

.running {
  border-left: 15px solid #FFC30B;
}
.text-running {
  color: #FFC30B;
  width: 20px;
}

.queued {
  border-left: 15px solid #2E77BB;
}
.text-queued {
  color: #2E77BB;
  width: 20px;
}

.failed {
  border-left: 15px solid #E74F4E;
}
.text-failed {
  color: #E74F4E;
  width: 20px;
}

.success {
  border-left: 15px solid #85CD3F;
}
.text-success {
  color: #85CD3F;
  width: 20px;
}

.item-pkg {
  font-style: italic;
  font-size: 15px;
}

</style>
