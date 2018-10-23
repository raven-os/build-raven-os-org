<template>
  <div id="create_build">
    <section id="create-build">
      <b-container>
        <!-- Create Build section -->
        <h1>Details</h1>
        <!-- Error handling -->
        <!-- <p v-if="loadingCreation">Loading ...</p> -->
        <b-container>

          <b-row class="m-2">
            <b-col>
              <b-input-group class="search-input-group create-input-group">
                <b-input-group-prepend>
                  <div class="input-prepend">Id</div>
                </b-input-group-prepend>
                <p id="name" class="form-control create-input">{{ id }}</p>
              </b-input-group>
            </b-col>
          </b-row>

          <b-row class="m-2">
            <b-col>
              <b-input-group class="search-input-group create-input-group">
                <b-input-group-prepend>
                  <div class="input-prepend input-prepend-high">Manifest</div>
                </b-input-group-prepend>
                <p id="manifest" class="form-control create-input create-input-high">{{ manifest }}</p>
              </b-input-group>
            </b-col>
          </b-row>

          <b-row class="m-2">
            <b-col>
              <b-input-group class="search-input-group create-input-group">
                <b-input-group-prepend>
                  <div class="input-prepend">Queuing</div>
                </b-input-group-prepend>
                <p id="queuing" class="form-control create-input">{{ queuing }}</p>
              </b-input-group>
            </b-col>
          </b-row>

          <b-row class="m-2">
            <b-col>
              <b-input-group class="search-input-group create-input-group">
                <b-input-group-prepend>
                  <div class="input-prepend">Running</div>
                </b-input-group-prepend>
                <p id="running" class="form-control create-input">{{ running }}</p>
              </b-input-group>
            </b-col>
          </b-row>

          <b-row class="m-2">
            <b-col>
              <b-input-group class="search-input-group create-input-group">
                <b-input-group-prepend>
                  <div class="input-prepend">Created_at</div>
                </b-input-group-prepend>
                <p id="created_at" class="form-control create-input">{{ created_at }}</p>
              </b-input-group>
            </b-col>
          </b-row>

          <b-row class="m-2">
            <b-col>
              <b-input-group class="search-input-group create-input-group">
                <b-input-group-prepend>
                  <div class="input-prepend">Started_at</div>
                </b-input-group-prepend>
                <p id="started_at" class="form-control create-input">{{ started_at }}</p>
              </b-input-group>
            </b-col>
          </b-row>

          <b-row class="m-2">
            <b-col>
              <b-input-group class="search-input-group create-input-group">
                <b-input-group-prepend>
                  <div class="input-prepend">Ended_at</div>
                </b-input-group-prepend>
                <p id="ended_at" class="form-control create-input">{{ ended_at }}</p>
              </b-input-group>
            </b-col>
          </b-row>
        </b-container>

        <form id="form-create" @submit.prevent="addToQueue()">
          <div style="text-align: center">
            <button v-if="!output && !running && !queuing" class="create-add" type="submit">Add to queue</button>
            <button v-else-if="output && !running && !queuing" class="create-add" type="submit">Rebuild</button>
          </div>
        </form>
        <div style="text-align: center; margin:10px">
          <!-- <p v-if="loadingCompilation">Loading ...</p>-->
          <textarea v-if="output" v-model="output" style="margin:10px; width:1000px; height: 400px"/>
        </div>
      </b-container>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      build: null,
      successCompilation: null,
      queue: null
    }
  },
  computed: {
    manifest () {
      return (this.build && this.build.manifest) || null
    },
    queuing () {
      return (this.build && this.build.queuing) || (this.queue && this.queue.queuing && this.queue.queuing.includes(this.id + '')) || false
    },
    running () {
      return (this.build && this.build.running) || (this.queue && this.queue.running && this.queue.running.includes(this.id + '')) || false
    },
    output () {
      return (this.build && this.build.output) || (this.queue && this.queue.running.includes(this.id + '') && this.queue.output) || null
    },
    created_at () {
      return (this.build && this.build.created_at && new Date(this.build.created_at).toLocaleString()) || null
    },
    started_at () {
      return (this.build && this.build.started_at && new Date(this.build.started_at).toLocaleString()) || null
    },
    ended_at () {
      return (this.build && this.build.ended_at && new Date(this.build.ended_at).toLocaleString()) || null
    }
  },
  mounted () {
    if (!window.ws) {
      window.ws = new WebSocket('ws://127.0.0.1:2794', ['rust-websocket'])
    }
    window.ws.vue = this
    window.ws.onmessage = function (e) {
      const json = e.data.replace(/[^\x20-\x7E]/g, '\\n')
      console.log(json)
      this.vue.queue = JSON.parse(json)
      console.log(this.vue.queue)
      if (this.vue.build.running && !this.vue.queue.running.includes(this.vue.id + '')) {
        this.vue.retrieve()
      }
    }
    this.retrieve()
  },
  methods: {
    retrieve () {
      this.$http.get('http://localhost:8000/builds/' + this.id).then(res => {
        this.build = res.body
        console.log(this.build)
      }, err => {
        console.error(err)
      })
    },
    addToQueue () {
      this.$http.post('http://localhost:8000/queue/', { name: this.id })
    }
  }
}
</script>

<style scoped>

/* CREATE-BUILD
----------------------------------- */
h2 {
  text-align: center;
  margin: 25px 0px;
}

#create-build {
  margin-top: 150px;
}

#create-build h1 {
  text-align: center;
  font-size: 45px;
  margin-top: 50px;
  margin-bottom: 50px;
}

input[type="file"]:focus {
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 0, 0, 0.6);
}

#form-create {
  width: 100%;
}

#create-build .create-input-group {
  margin-bottom: 20px;
}

#create-build .input-prepend {
  font-family: sans-serif;
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  padding: 12px 28px;
  border-width: 1px 0px 1px 1px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--white);
  border-radius: 5px 0px 0px 5px;
  height: 50px;
  background: var(--accent);
  width: 150px;
  vertical-align: middle !important;
}
#create-build .input-prepend-high {
  padding-top: 130px;
}

#create-build .create-input {
  font-family: sans-serif;
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  padding: 8px 28px;
  border-width: 1px 1px 1px 0px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--primary-dark);
  background: rgba(247, 244, 248, 0.7);
  border-radius: 0px 5px 5px 0px;
  height: 50px;
}

#create-build .create-input-high,
#create-build .input-prepend-high {
  height: 300px;
}

#create-build .create-input-high {
  overflow: auto;
  text-align: justify;
  resize: none;
}

#create-build .create-add {
  font-family: sans-serif;
  font-size: 16px;
  padding: 8px 18px;
  border-width: 1px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--white);
  border-radius: 5px;
  height: 50px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: var(--accent);
  width: 150px;
  display: block;
  margin: 0 auto;
}

.form-control:focus {
  border-color: transparent;
  box-shadow: none;
  outline: -webkit-focus-ring-color auto 0px;
}

/* BUILD-ERROR
----------------------------------- */
.build-error {
  text-align: center;
  margin-bottom: 25px;
  color: var(--accent);
}
</style>
