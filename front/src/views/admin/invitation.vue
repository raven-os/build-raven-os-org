<template>
  <div id="app">
    <section id="builds-search">
      <b-container>
        <h1>Invitation</h1>
        <div class="invit-zone">
        <form @submit.prevent="invitationHandler()">
          <b-container>
            <b-row class="m-2">
              <b-col>
                <b-input-group class="search-input-group create-input-group">
                  <b-input-group-prepend>
                    <div class="input-prepend">Email</div>
                  </b-input-group-prepend>
                  <input
                    id="user_email"
                    v-model="email"
                    class="form-control create-input"
                    type="email"
                    placeholder="Email">
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <b-col>
                <b-input-group class="search-input-group create-input-group">
                  <b-input-group-prepend>
                    <div class="input-prepend">Expires in</div>
                  </b-input-group-prepend>
                  <input
                    id="expiration_time"
                    v-model="expire_after"
                    class="form-control create-input"
                    type="number"
                    placeholder="Expire after x minutes">
                    <b-input-group-append>
                      <div class="input-append">minutes</div>
                    </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <b-col>
                <b-input-group class="search-input-group create-input-group">
                  <b-input-group-prepend>
                    <div class="input-prepend">Administrator</div>
                  </b-input-group-prepend>
                  <div class="custom-control form-control-lg custom-checkbox">
                    <input id="administrator" type="checkbox" v-model="isAdmin" class="custom-control-input">  
                    <label class="custom-control-label" for="administrator"></label>  
                  </div>
                </b-input-group>
              </b-col>
            </b-row>
            <b-row>
              <button class="create-add" type="submit">Send invitation</button>
            </b-row>
          </b-container>
        </form>
        </div>
      </b-container>
    </section>

    <!-- error handling -->
    <div v-if="getInvitationLoadings.create" class="loading">
      Sending invitation...
    </div>
    <div v-if="error || getInvitationErrors.create" class="build-error">
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

.custom-checkbox {
  margin-left: 15px;
  height: 40px;
}

.custom-control-label:before{
  background-color:white;
}

.custom-checkbox .custom-control-input:checked~.custom-control-label::before{
  background-color: var(--accent);
  border: 1px solid var(--accent);
}
.custom-checkbox .custom-control-input:checked~.custom-control-label::after{
  background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='white' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E");
}

.custom-checkbox .custom-control-input:focus~.custom-control-label::before{
  box-shadow: none;
}

.invit-zone {
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

.input-append {
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  padding: 8px 28px;
  border-width: 1px 1px 1px 0px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--white);
  border-radius: 0px 5px 5px 0px;
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

.create-input:checked~ {
  background-color: var(--accent)
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

</style>
