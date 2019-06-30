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
        <p v-if="errorCreation" class="build-error">{{ errorCreation }}</p>
        <p v-if="successCreation" class="build-error">The build has been successfully added!</p>

        <form id="form-create" @submit.prevent="addBuild()">
          <b-container>
            <b-row class="m-2">
              <b-col>
                <!-- A build has no name -->
                <b-input-group invisible class="search-input-group create-input-group">
                  <b-input-group-prepend>
                    <div class="input-prepend">Name</div>
                  </b-input-group-prepend>
                  <input id="name" v-model="name" class="form-control create-input" type="text" placeholder="Build name">
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <b-col>
                <b-input-group class="search-input-group create-input-group">
                  <b-input-group-prepend>
                    <div class="input-prepend" style="background:grey;">ID</div>
                  </b-input-group-prepend>
                  <input
                    id="package_id" v-model="package_id" class="form-control create-input" type="text"
                    placeholder="ID"
                    readonly="true">
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="m-2 mb-4 text-center">
              <b-col>
                <treeselect
                  v-model="manifests" :multiple="true" :options="allManifests"
                  placeholder="Select the manifests" class="tree-select text-center" />
              </b-col>
            </b-row>
            <b-row>
              <button class="create-add" type="submit">Add build</button>
              <p :if="buildId">#{{ buildId }} created</p>
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
      results: {
        creation: { loading: false, error: null, data: [], success: false },
        compilation: { loading: false, error: null, success: '' }
      },
      name: null,
      manifests: null, // this one is the manifests selected for the build
      package_id: null,
      buildId: null
    }
  },
  computed: {
    ...mapGetters('manifest', ['getManifests']),
    allManifests () {
      return Object.keys(this.getManifests).map((key) => {
        return { id: key, label: '#' + key + ': ' + this.getManifests[key].name }
      })
    },
    loadingCreation () {
      return this.results.creation.loading
    },
    errorCreation () {
      return this.results.creation.error
    },
    successCreation () {
      return this.results.creation.success
    },
    loadingCompilation () {
      return this.results.compilation.loading
    },
    errorCompilation () {
      return this.results.compilation.error || ''
    },
    successCompilation () {
      return this.results.compilation.success
    }
  },
  beforeMount () {
    this.listManifests()
  },
  methods: {
    ...mapActions('manifest', ['listManifests']),
    ...mapActions('build', ['createBuild']),
    getPackageId () {
      const idRegex = /@package\s*\(\s*id\s*=\s*"(.*)"/g

      const match = idRegex.exec(this.manifest)
      this.package_id = (match && match[1]) || null
    },
    addCompileOutput (txt) {
      this.results.compilation.success += txt
    },
    addBuild () {
      this.createBuild(this.manifests).then(build => {
        this.buildId = build && build.id
      })
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
