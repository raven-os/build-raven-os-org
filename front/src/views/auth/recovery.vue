<template>
  <div id="app">
    <h1>Recover password</h1>
    <div v-if="successMessage">{{ successMessage }}</div>
    <form @submit.prevent="sendMailHandler()">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        autocomplete="email"
      >
      <button type="submit">Send email</button>
    </form>
    <form @submit.prevent="resetPasswordHandler()">
      <input
        v-model="token"
        type="text"
        placeholder="Code"
      >
      <input
        v-model="password"
        type="password"
        placeholder="Password"
      >
      <button type="submit">Reset password</button>
    </form>

    <!-- error handling -->
    <div v-if="loading" class="loading">loading...</div>
    <div v-if="error" class="build-error">
      <p>An error occurred</p>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      error_: null,
      email: null,
      token: null,
      password: null,
      successMessage: null
    }
  },
  computed: {
    ...mapGetters('auth', ['getAuthLoadings', 'getAuthErrors']),
    loading () {
      return this.getAuthLoadings.forgotPassword || this.getAuthLoadings.resetPassword
    },
    error () {
      return this.error_ || this.getAuthErrors.forgotPassword || this.getAuthErrors.resetPassword
    }
  },
  methods: {
    ...mapActions('auth', ['forgotPassword', 'resetPassword']),
    sendMailHandler () {
      this.error_ = null
      this.successMessage = null

      if (!this.email) {
        this.error = 'You must complete your email.'
        return
      }

      this.forgotPassword({ email: this.email }).then(() => {
        if (!this.getAuthErrors.forgotPassword) {
          this.successMessage = 'Email sent'
        }
      })
    },
    resetPasswordHandler () {
      this.error_ = null
      this.successMessage = null

      if (!this.token || !this.password) {
        this.error_ = 'You must complete the code and password fields'
        return
      }

      this.resetPassword({ token: this.token, password: this.password }).then(() => {
        if (!this.getAuthErrors.resetPassword) {
          this.successMessage = 'Password reset, now login'
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
