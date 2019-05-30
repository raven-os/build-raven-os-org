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
      <table border="2" align="center" style="text-align:center;">
        <tr>
          <th>Creation date</th>
          <th>Last update</th>
        </tr>
        <tr>
          <td>{{ manifest && manifest.creation_date}}</td>
          <td>{{ manifest && manifest.last_update }}</td>
        </tr>
      </table>
      <b-table invisible
        id="date-table"
        :fields="dateFields"
        tbody-tr-class="table-row-nohover"
        thead-class="list-thead"
        responsive
      />
      <div class="manifest-space">
        <div class="manifest-thead">Manifest</div>
        <prism language="python">{{ content }}</prism>
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
      type: String,
      required: true
    }
  },
  data () {
    return {
      name: '',
      created_at: '',
      updated_at: '',
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
    ...mapGetters('manifest', ['getManifest']),
    manifest () {
      return this.getManifest(this.id)
    },
    content () {
      const size = this.manifest && this.manifest.history && this.manifest.history.length

      if (Number(size)) {
        return this.manifest.history[size - 1].content
      }

      return null
    }
  },
  beforeMount () {
    this.retrieveManifest(this.id)
  },
  methods: {
    ...mapActions('manifest', ['retrieveManifest'])
  }
}
</script>

<style scoped>
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
