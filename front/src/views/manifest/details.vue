<template>
  <div id="app">
    <b-container class="top-container">
      <b-row>
        <b-col>
          <div class="manifest-name">
            {{ manifest && manifest.name }}
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="mid-container">
      <!-- error handling -->
      <div v-if="getBuildLoadings.create" class="text-loading">
        Adding the build...
      </div>
      <div v-if="getBuildErrors.create" class="text-error">
        <p>An error occurred preventing the creation of the build</p>
        <p>{{ getBuildErrors.create }}</p>
      </div>

      <div v-if="buildId" class="text-success">
        <p>Build successfully created</p>
        <a :href="'/builds/details/' + buildId">
          <u>#{{ buildId }}</u>
        </a>
      </div>

      <div v-if="getManifestLoadings.get" class="text-loading">
        Retrieving manifest...
      </div>
      <div v-if="getManifestErrors.get" class="text-error">
        <p>An error occurred while retrieving manifest #{{ id }}</p>
        <p>{{ getManifestErrors.get }}</p>
      </div>

      <table id="date-table" class="table b-table table-striped">
        <thead class="list-thead">
          <tr>
            <th>Id</th>
            <th>Creation date</th>
            <th>Last update</th>
            <th>Author</th>
            <th>Maintainer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-row-nohover">
            <td class="list-table-cell">
              {{ manifest && manifest.id }}
            </td>
            <td class="list-table-cell">
              {{ manifest && _date(manifest.creation_date) }}
            </td>
            <td class="list-table-cell">
              {{ manifest && _date(manifest.last_update) }}
            </td>
            <td class="list-table-cell">
              {{ author }}
            </td>
            <td class="list-table-cell">
              {{ maintainer }}
            </td>
            <td class="list-table-cell">
              <a v-if="isMaintainer || isAdmin" :href="'/manifests/update/' + id" class="text-accent">
                <i class="fas fa-edit" />
              </a>
              <a class="text-accent ml-2" :href="'#'">
                <i class="fas fa-hammer" @click.prevent="build()" />
              </a>
              <a v-if="isAdmin" class="text-accent ml-2" style="cursor: pointer" @click="openSettings = !openSettings">
                <i class="fas fa-user-cog" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="openSettings">
        <table id="settings" class="table b-table table-striped">
          <thead class="list-thead">
            <tr>
              <th>Settings: Change maintainer</th>
            </tr>
          </thead>
          <tbody>
            <tr class="box-settings">
              <div style="padding: 10px;">
                <b-input-group class="custom-input-group">
                  <b-input-group-prepend class="custom-input-group-prepend">
                    <label for="lastname">Name</label>
                  </b-input-group-prepend>
                  <input
                    id="lastname"
                    v-model="query"
                    class="form-control custom-input"
                    type="text"
                    placeholder="Search for a maintainer"
                    autocomplete="lastname"
                  >
                </b-input-group>
                <div v-if="query">
                  <b-container>
                    <b-row v-for="user in getUserList" :key="user.id" class="mb-2">
                      <b-col>
                        <span style="font-weight: bold">#{{ user.id }}: {{ user.firstname }} {{ user.lastname }}</span> ({{ user.email }})
                      </b-col>
                      <b-col>
                        <button class="set-maintainer-button ml-5" @click.prevent="setMaintainer(user.id)">
                          Define as new maintainer
                        </button>
                      </b-col>
                    </b-row>
                  </b-container>
                </div>
              </div>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div :if="historySize">
          <table id="history-table" class="table table-striped table-hover table-row-nohover">
            <thead class="list-thead">
              <tr>
                <th>Manifest history</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in historyReversed" :key="item.id" class="bg-light-accent-hover">
                <td class="list-table-cell manifest-history-row" @click="historyIndex = index">
                  <a :class="index === historyIndex ? 'historySelected' : ''">
                    {{ _date(item.edition_date) }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <table id="manifest-table" class="table b-table table-striped">
            <thead class="list-thead">
              <tr>
                <th>Manifest</th>
              </tr>
            </thead>
            <tbody>
              <prism language="python">
                {{ content }}
              </prism>
            </tbody>
          </table>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import Prism from 'vue-prism-component'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Prism
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      query: null,
      historyIndex: 0,
      buildId: null,
      openSettings: false
    }
  },
  computed: {
    ...mapGetters('manifest', ['getManifest', 'getManifestLoadings', 'getManifestErrors']),
    ...mapGetters('auth', ['getAuthUser']),
    ...mapGetters('user', ['getUserLoadings', 'getUserErrors', 'getUserList']),
    ...mapGetters('build', ['getBuildLoadings', 'getBuildErrors']),
    _id () {
      return Number(this.id) || this.id
    },
    manifest () {
      return this.getManifest(this._id)
    },
    historySize () {
      return (this.manifest && this.manifest.history && this.manifest.history.length) || null
    },
    historyReversed () {
      return (this.historySize && this.manifest.history.slice().reverse()) || null
    },
    content () {
      return this.historySize && this.historyReversed[this.historyIndex].content
    },
    author () {
      return this.manifest && this.manifest.author && `${this.manifest.author.firstname} ${this.manifest.author.lastname}`
    },
    maintainer () {
      return this.manifest && this.manifest.maintainer && `${this.manifest.maintainer.firstname} ${this.manifest.maintainer.lastname}`
    },
    isMaintainer () {
      return this.manifest && this.manifest.maintainer && this.manifest.maintainer.id === this.getAuthUser.id
    },
    isAdmin () {
      return this.getAuthUser.rights && this.getAuthUser.rights.includes('admin')
    }
  },
  watch: {
    query: 'search'
  },
  beforeMount () {
    this.retrieveManifest(this._id)
  },
  methods: {
    ...mapActions('manifest', ['retrieveManifest', 'updateManifestMaintainer']),
    ...mapActions('user', ['list']),
    ...mapActions('build', ['createBuild']),
    _date (value) {
      return (value && moment(value).format('MMM Do YYYY, HH:mm:ss')) || null
    },
    search () {
      if (!this.isAdmin || !this.query || this.query.length < 1) {
        return
      }

      this.list(this.query)
    },
    setMaintainer (maintainer) {
      this.updateManifestMaintainer({ id: this.manifest.id, maintainer })
    },
    build () {
      this.buildId = null
      this.createBuild([this._id]).then(build => {
        this.buildId = build && build.id
      })
    }
  }
}
</script>

<style scoped>
.historySelected {
  font-weight: bold;
  padding-left: 15px;
}

.list-table-cell {
  color: black;
}

.top-container {
  margin-top: 150px;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 30px;
}

.mid-container {
  margin-top: 50px;
}

.manifest-name {
  text-align: center;
  font-size: 45px;
  color: var(--accent);
}

.manifest-history-row:hover {
  cursor: pointer;
}

/* Settings */
.box-settings {
  background-color: var(--mid-grey);
  padding: 10px;
  border-bottom: 1px solid var(--accent);
  margin-bottom: 15px;
}

.set-maintainer-button {
  font-size: 14px;
  padding: 3px;
  border: 1px solid var(--primary-dark);
  color: var(--white);
  border-radius: 5px;
  height: 30px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: var(--accent);
  width: 200px;
}
</style>
