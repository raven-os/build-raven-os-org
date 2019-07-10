<template>
  <div id="app">
    <b-container class="top-container">
      <b-row>
        <b-col>
          <div class="manifest-name">{{ manifest && manifest.name }}</div>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="mid-container">

      <!-- error handling -->
      <div v-if="getManifestLoadings.get" class="loading">
        retrieving manifest...
      </div>
      <div v-if="getManifestErrors.get" class="build-error">
        <p>An error has occured during the retrieving of manifest #{{ id }}</p>
        <p>{{ getManifestErrors.get }}</p>
      </div>

      <table id="date-table" class="table b-table table-striped">
        <thead class="list-thead">
          <tr>
            <th>Id</th>
            <th>creation date</th>
            <th>last update</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-row-nohover">
            <td class="list-table-cell">{{ manifest && manifest.id }}</td>
            <td class="list-table-cell">{{ manifest && _date(manifest.creation_date) }}</td>
            <td class="list-table-cell">{{ manifest && _date(manifest.last_update) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="manifest-space">
        <div class="manifest-thead">Manifest History</div>
        <div :if="historySize">
          <div
            v-for="(item, index) in historyReversed"
            :key="item.id">
            <a :class="index === historyIndex ? 'historySelected' : ''" @click="historyIndex = index">
              {{ _date(item.edition_date) }}
            </a>
          </div>

          <div class="manifest-thead">Manifest</div>
          <prism language="python">{{ content }}</prism>
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
    }
  },
  beforeMount () {
    this.retrieveManifest(this._id)
  },
  methods: {
    ...mapActions('manifest', ['retrieveManifest']),
    _date (value) {
      return (value && moment(value).format('MMMM Do YYYY, HH:mm:ss')) || null
    }
  }
}
</script>

<style scoped>
.historySelected {
  font-weight: bold;
  padding: 1em;
}

.loading {
  color: blue;
  font-weight: bold;
  text-align: center;
  margin-bottom: 25px;
}

.build-error {
  text-align: center;
  margin-bottom: 25px;
  color: var(--accent);
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

.manifest-space {
  border-bottom: 1px solid var(--accent);
}

.manifest-thead {
  background-color: rgba(52, 52, 50, 0.9);
  color: var(--white) !important;
  font-weight: bold;
  padding: 14px;
  font-size: 16px;
}
</style>
