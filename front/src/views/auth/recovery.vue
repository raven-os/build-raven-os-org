<template>
  <div id="app">
    <section id="recovery-section">
      <h1>Recover password</h1>
      <div v-if="successMessage">{{ successMessage }}</div>
      <div class="inputs-zone">
        <b-container class="mt-5 mb-3">
          <b-row>
            <b-col>
              <div style="text-align: center;">
                Enter your email to receive a code to reset your password.
              </div>
            </b-col>
          </b-row>
        </b-container>
        <form @submit.prevent="sendMailHandler()">
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
              <b-col cols="2">
                <button type="submit" class="custom-button">Send email</button>
              </b-col>
            </b-row>
          </b-container>
        </form>
        <b-container class="mt-5 mb-3">
          <b-row>
            <b-col>
              <div style="text-align: center;">
                Enter the code you have received by email and your new password.
              </div>
            </b-col>
          </b-row>
        </b-container>
        <form @submit.prevent="resetPasswordHandler()">
          <b-container>
            <b-row class="m-2">
              <b-col>
                <b-input-group class="custom-input-group">
                  <b-input-group-prepend class="custom-input-group-prepend">
                    Code
                  </b-input-group-prepend>
                  <input
                    v-model="token"
                    class="form-control custom-input"
                    type="text"
                    placeholder="Code"
                  >
                </b-input-group>
              </b-col>
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
                  >
                </b-input-group>
              </b-col>
              <b-col cols="2">
                <button type="submit" class="custom-button">Reset</button>
              </b-col>
            </b-row>
          </b-container>
        </form>
      </div>
    </section>

    <!-- error handling -->
    <div v-if="loading" class="text-loading">loading...</div>
    <div v-if="error" class="text-error">
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
      return (
        this.getAuthLoadings.forgotPassword ||
        this.getAuthLoadings.resetPassword
      )
    },
    error () {
      return (
        this.error_ ||
        this.getAuthErrors.forgotPassword ||
        this.getAuthErrors.resetPassword
      )
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

      this.resetPassword({ token: this.token, password: this.password }).then(
        () => {
          if (!this.getAuthErrors.resetPassword) {
            this.successMessage = 'Password reset, now login'
          }
        }
      )
    }
  }
}
</script>

<style scoped>
#recovery-section {
  margin-top: 200px;
}

.inputs-zone {
  margin-top: 75px;
  margin-bottom: 100px;
}

.local-button {
  border-radius: 0px 5px 5px 0px;
}
</style>
