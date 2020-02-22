<template>
  <div id="app">
    <section id="section-invit">
      <b-container>
        <h1>Invitation</h1>
        <div class="invit-zone">
          <form @submit.prevent="invitationHandler()">
            <b-container>
              <b-row class="m-2">
                <b-col>
                  <b-input-group class="custom-input-group">
                    <b-input-group-prepend class="custom-input-group-prepend">
                      Email
                    </b-input-group-prepend>
                    <input
                      id="user_email"
                      v-model="email"
                      class="form-control custom-input"
                      type="email"
                      placeholder="Email"
                    >
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="m-2">
                <b-col>
                  <b-input-group class="custom-input-group">
                    <b-input-group-prepend class="custom-input-group-prepend">
                      Expires in
                    </b-input-group-prepend>
                    <input
                      id="expiration_time"
                      v-model="expire_after"
                      class="form-control custom-input"
                      type="number"
                      placeholder="Expire after x minutes"
                    >
                    <b-input-group-append class="custom-input-group-append">
                      minutes
                    </b-input-group-append>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="m-2">
                <b-col>
                  <b-input-group class="custom-input-group">
                    <b-input-group-prepend class="custom-input-group-prepend">
                      Administrator
                    </b-input-group-prepend>
                    <div class="custom-control form-control-lg custom-checkbox">
                      <input
                        id="administrator"
                        v-model="isAdmin"
                        type="checkbox"
                        class="custom-control-input"
                      >
                      <label class="custom-control-label" for="administrator" />
                    </div>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row>
                <button class="custom-button" type="submit">
                  Send invitation
                </button>
              </b-row>
            </b-container>
          </form>
        </div>
      </b-container>
    </section>

    <!-- error handling -->
    <div v-if="getInvitationLoadings.create" class="text-loading">
      Sending invitation...
    </div>
    <div v-if="error || getInvitationErrors.create" class="text-error">
      <p>An error occurred while sending invitation</p>
      <p>{{ error || getInvitationErrors.create }}</p>
    </div>
    <div v-else-if="sent" class="success">
      <p>Email sent successfully</p>
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
      expire_after: 30,
      isAdmin: false,
      sent: false
    }
  },
  computed: {
    ...mapGetters('invitation', [
      'getInvitationLoadings',
      'getInvitationErrors'
    ])
  },
  methods: {
    ...mapActions('invitation', ['create']),
    invitationHandler () {
      this.error = null
      this.sent = false

      if (!this.email || !this.expire_after) {
        this.error = 'You must complete all fields.'
        return
      }

      const invitation = {
        email: this.email,
        expire_after: this.expire_after,
        rights: this.isAdmin ? ['admin'] : []
      }
      this.create(invitation).then(() => {
        this.sent = true
      })
    }
  }
}
</script>

<style scoped>

/* SECTION INVIT
----------------------------------- */
#section-invit {
  margin-top: 200px;
}

.invit-zone {
  margin-top: 75px;
  margin-bottom: 100px;
}

</style>
