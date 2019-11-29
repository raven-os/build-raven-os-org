<template>
  <div id="create_build">
    <!--==========================
    Section Create
    ============================-->
    <section id="create-build">
      <b-container>
        <!-- Create Build section -->
        <h1 class="my-4">
          Create build
        </h1>
        <!-- Error handling -->
        <div v-if="getBuildLoadings.create" class="text-loading">
          Adding the build...
        </div>
        <div v-if="error || getBuildErrors.create" class="text-error">
          <p>An error occurred preventing the creation of the build</p>
          <p>{{ error || getBuildErrors.create }}</p>
        </div>
        <div v-if="buildId" class="text-success">
          <p>Build successfully created</p>
          <a :href="'/builds/details/' + buildId">
            <u>#{{ buildId }}</u>
          </a>
        </div>

        <div v-if="getManifestLoadings.list" class="text-loading">
          Loading
        </div>
        <div v-else-if="getManifestErrors.list" class="text-error">
          <p>An error occurred, please try again later</p>
          <p>{{ getManifestErrors.list }}</p>
        </div>
        <form v-else id="form-create" @submit.prevent="create()">
          <b-container>
            <b-row class="m-2 mb-4 text-center">
              <b-col>
                <treeselect
                  v-model="selectedManifests" :multiple="true" :options="manifestList"
                  placeholder="Select the manifests" class="tree-select text-center"
                />
              </b-col>
            </b-row>
            <b-row>
              <button class="custom-button" type="submit">
                Create
              </button>
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
        const manifest = this.getManifests[key]

        return { id: manifest.id, label: `${manifest.id}: ${manifest.name}` }
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
#create-build {
  margin-top: 200px;
}

input[type="file"]:focus {
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 0, 0, 0.6);
}

#form-create {
  width: 100%;
}
</style>
