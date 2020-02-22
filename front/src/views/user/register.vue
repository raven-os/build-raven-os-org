<template>
  <div id="app">
    <section id="builds-search">
      <b-container>
        <h1 class="my-5">
          Register
        </h1>
        <div class="register-zone">
          <form @submit.prevent="registerHandler()">
            <b-input-group class="custom-input-group">
              <b-input-group-prepend class="custom-input-group-prepend">
                <label for="invitationCode">Code</label>
              </b-input-group-prepend>
              <input
                id="invitationCode"
                v-model="invitationCode"
                class="form-control custom-input"
                type="text"
                placeholder="Invitation code"
              >
            </b-input-group>

            <b-input-group class="custom-input-group">
              <b-input-group-prepend class="custom-input-group-prepend">
                <label for="firstname">Firstname</label>
              </b-input-group-prepend>
              <input
                id="firstname"
                v-model="firstname"
                class="form-control custom-input"
                type="text"
                placeholder="Firstname"
                autocomplete="firstname"
              >
            </b-input-group>

            <b-input-group class="custom-input-group">
              <b-input-group-prepend class="custom-input-group-prepend">
                <label for="lastname">Lastname</label>
              </b-input-group-prepend>
              <input
                id="lastname"
                v-model="lastname"
                class="form-control custom-input"
                type="text"
                placeholder="Lastname"
                autocomplete="lastname"
              >
            </b-input-group>

            <b-input-group class="custom-input-group">
              <b-input-group-prepend class="custom-input-group-prepend">
                <label for="password">Password</label>
              </b-input-group-prepend>
              <input
                id="password"
                v-model="password"
                class="form-control custom-input"
                type="password"
                placeholder="Password"
                autocomplete="current-password"
              >
            </b-input-group>

            <button class="custom-button" type="submit">
              Sign In
            </button>
          </form>
        </div>
      </b-container>
    </section>

    <!-- error handling -->
    <div v-if="getUserLoadings.create" class="text-loading">
      Creating account...
    </div>
    <div v-if="error || getUserErrors.create" class="text-error">
      <p>An error occurred while creating account</p>
      <p>{{ error || getUserErrors.create }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      error: null,
      invitationCode: null,
      firstname: null,
      lastname: null,
      password: null
    }
  },
  computed: {
    ...mapGetters('user', ['getUserLoadings', 'getUserErrors'])
  },
  methods: {
    ...mapActions('user', ['create']),
    registerHandler () {
      this.error = null

      if (
        !this.invitationCode ||
        !this.firstname ||
        !this.lastname ||
        !this.password
      ) {
        this.error = 'You must complete all fields.'
        return
      }

      const user = {
        invitation: this.invitationCode,
        firstname: this.firstname,
        lastname: this.lastname,
        password: this.password
      }

      this.create(user).then(user => {
        if (user) {
          this.$router.push({ path: '/login' })
        }
      })
    }
  }
}
</script>

<style scoped>
/* BUILDS-SEARCH
----------------------------------- */
#builds-search {
  margin-top: 200px;
}

.register-zone {
  margin-top: 75px;
  margin-bottom: 100px;
}
</style>
