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
              <a class="text-accent ml-2">
                <i class="fas fa-hammer" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="isAdmin">
        <p>Change maintainer</p>
        <input
          v-model="query"
          type="text"
          placeholder="Search for a maintainer"
        >
        <div v-if="query">
          <div v-for="user in getUserList" :key="user.id">
            <span>
              #{{ user.id }}: {{ user.firstname }} {{ user.lastname }} ({{ user.email }})
              <button @click.prevent="setMaintainer(user.id)">Define as new maintainer</button>
            </span>
          </div>
        </div>
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
      dateFields: [
        {
          key: 'created_at',
          label: 'Creation date',
          class: 'td-date',
          tdClass: 'list-table-cell',
          formatter: value => {
            if (value) {
              return moment(value).format('MMMM Do YYYY, HH:mm:ss')
            } else {
              return ''
            }
          }
        },
        {
          key: 'updated_at',
          label: 'last update',
          class: 'td-date',
          tdClass: 'list-table-cell',
          formatter: value => {
            if (value) {
              return moment(value).format('MMMM Do YYYY, HH:mm:ss')
            } else {
              return ''
            }
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters('manifest', ['getManifest', 'getManifestLoadings', 'getManifestErrors']),
    ...mapGetters('auth', ['getAuthUser']),
    ...mapGetters('user', ['getUserLoadings', 'getUserErrors', 'getUserList']),
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
    _date (value) {
      return (value && moment(value).format('MMMM Do YYYY, HH:mm:ss')) || null
    },
    search () {
      if (!this.isAdmin || !this.query || this.query.length < 1) {
        return
      }

      this.list(this.query)
    },
    setMaintainer (maintainer) {
      this.updateManifestMaintainer({ id: this.manifest.id, maintainer })
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
</style>
