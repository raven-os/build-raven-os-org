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
        </b-container>

        <form v-if="!output && !running && !queuing" id="form-create" @submit.prevent="addToQueue()">
          <div style="text-align: center">
            <button class="create-add" type="submit">Add to queue</button>
          </div>
        </form>
        <div style="text-align: center; margin:10px">
          <!-- <p v-if="loadingCompilation">Loading ...</p>-->
          <textarea v-if="successCompilation" v-model="successCompilation" style="margin:10px; width:1000px; height: 400px"/>
        </div>
      </b-container>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      build: null,
      successCompilation: null
    }
  },
  computed: {
    manifest () {
      return (this.build && this.build.manifest) || null
    },
    queuing () {
      return (this.build && this.build.queuing) || false
    },
    running () {
      return (this.build && this.build.running) || false
    },
    output () {
      return (this.build && this.build.output) || null
    }
  },
  mounted () {
    this.$http.get('http://localhost:8000/builds/' + this.id).then(res => {
      this.build = res.body
    }, err => {
      console.error(err)
    })
  },
  methods: {
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
