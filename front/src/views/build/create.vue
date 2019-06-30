<template>
  <div id="create_build">
    <!--==========================
    Section Create
    ============================-->
    <section id="create-build">
      <b-container>
        <!-- Create Build section -->
        <h1>Create build</h1>
        <!-- Error handling -->
        <div v-if="getBuildLoadings.create" class="loading">
          adding the build...
        </div>
        <div v-if="error || getBuildErrors.create" class="build-error">
          <p>An error has occured during the creation of the build</p>
          <p>{{ error || getBuildErrors.create }}</p>
        </div>
        <div v-if="buildId" class="success">
          <p>Build successfully created</p>
          <a :href="'/builds/details/' + buildId">
            <u>#{{ buildId }}</u>
          </a>
        </div>

        <div v-if="getManifestLoadings.list" class="loading">
          loading
        </div>
        <div v-else-if="getManifestErrors.list" class="build-error">
          <p>An error has occured, please refresh or try again later</p>
          <p>{{ getManifestErrors.list }}</p>
        </div>
        <form v-else id="form-create" @submit.prevent="create()">
          <b-container>
            <b-row class="m-2 mb-4 text-center">
              <b-col>
                <treeselect
                  v-model="selectedManifests" :multiple="true" :options="manifestList"
                  placeholder="Select the manifests" class="tree-select text-center" />
              </b-col>
            </b-row>
            <b-row>
              <button class="create-add" type="submit">Create</button>
            </b-row>
          </b-container>
        </form>
      </b-container>
    </section>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Treeselect
  },
  data () {
    return {
      selectedManifests: [],
      buildId: null,
      error: null
    }
  },
  computed: {
    ...mapGetters('manifest', ['getManifests', 'getManifestLoadings', 'getManifestErrors']),
    ...mapGetters('build', ['getBuildLoadings', 'getBuildErrors']),
    manifestList () {
      return Object.keys(this.getManifests).map((key) => {
        return { id: key, label: '#' + key + ': ' + this.getManifests[key].name }
      })
    }
  },
  beforeMount () {
    this.listManifests()
  },
  methods: {
    ...mapActions('manifest', ['listManifests']),
    ...mapActions('build', ['createBuild']),
    create () {
      this.error = null
      this.buildId = null

      if (!this.selectedManifests.length) {
        this.error = 'You must select at least one manifest'
        return
      }

      this.createBuild(this.selectedManifests).then(build => {
        this.buildId = build && build.id
        this.selectedManifests = []
      })
    }
  }
}
</script>

<style scoped>

/* CREATE-BUILD
----------------------------------- */
.loading {
  color: blue;
  font-weight: bold;
  text-align: center;
  margin-bottom: 25px;
}

.success {
  color: green;
  font-weight: bold;
  text-align: center;
  margin-bottom: 25px;
}

h2 {
  text-align: center;
  margin: 25px 0px;
}

#create-build {
  margin-top: 200px;
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

.manifest-explain {
  text-align: center;
  font-size: 20px;
  margin-top: 50px;
}

.file-import {
  margin-top: 30px;
}

.code-editor {
  margin-top: 50px;
  margin-bottom: 50px;
}

.tree-select {
}

/* BUILD-ERROR
----------------------------------- */
.build-error {
  text-align: center;
  margin-bottom: 25px;
  color: var(--accent);
}
</style>
