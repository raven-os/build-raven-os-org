<template>
  <div id="app">
    <b-container class="top-container">
      <b-row>
        <b-col>
          <div class="manifest-name">#{{ build && build.id }}</div>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="mid-container">
      <table border="2" align="center" style="text-align:center;">
        <tr>
          <th>Id</th>
          <th>State</th>
          <th>exit_status</th>
          <th>creation date</th>
          <th>start date</th>
          <th>end at</th>
        </tr>
        <tr>
          <td>{{ build && build.id }}</td>
          <td>{{ build && build.state }}</td>
          <td>{{ (build && build.exit_status) || '-' }}</td>
          <td>{{ build && build.creation_date }}</td>
          <td>{{ (build && build.start_date) || '-' }}</td>
          <td>{{ (build && build.end_date) || '-' }}</td>
        </tr>
      </table>
      Packages
      <div :if="build && build.packages && build.packages.length">
        <div v-for="(pkg, index) in build && build.packages" :key="index">
          <template><span :key="index">{{ pkg }}</span></template>
        </div>
      </div>
      <b-table
        id="date-table"
        :fields="dateFields"
        class="white"
        style="color: white; color: #ffffff; color: { color: white; }"
        tbody-tr-class="table-row-nohover"
        thead-class="list-thead"
        responsive invisible />

      <b-table
        id="packages-table"
        :fields="pkgFields"
        tbody-tr-class="table-row-nohover"
        thead-class="list-thead"
        responsive
        striped
        show-empty
        invisible
        empty-text="No package for this manifest" />

      <div>
        <h3>Output</h3>
        <code>{{ build && build.stdout }}</code>
      </div>
      <div>
        <h4>Error</h4>
        <code>{{ build && build.stderr }}</code>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      successCompilation: null,
      queue: null,
      name: '',
      created_at: '',
      started_at: '',
      ended_at: '',
      state: 0,
      packages: '',
      dateFields: [
        { key: 'created_at',
          label: 'Creation date',
          class: 'td-date',
          tdClass: 'list-table-cell',
          formatter: (value) => {
            if (value) {
              return moment((value)).format('MMMM Do YYYY, HH:mm:ss')
            } else {
              return ''
            }
          }
        },
        { key: 'state',
          label: 'Build state',
          class: 'td-state',
          tdClass: 'list-table-cell',
          formatter: (value) => {
            switch (value) {
              case 0:
                return 'In queue'
              case 1:
                return 'Building'
              case 2:
                return 'Failed'
              case 3:
                return 'Successful'
            }
          }
        },
        { key: 'started_at',
          label: 'Start date',
          class: 'td-date',
          tdClass: 'list-table-cell',
          formatter: (value) => {
            if (value) {
              return moment((value)).format('MMMM Do YYYY, HH:mm:ss')
            } else {
              return ''
            }
          }
        },
        { key: 'ended_at',
          label: 'End date',
          class: 'td-date',
          tdClass: 'list-table-cell',
          formatter: (value) => {
            if (value) {
              return moment((value)).format('MMMM Do YYYY, HH:mm:ss')
            } else {
              return ''
            }
          }
        }
      ],
      pkgFields: [
        { key: 'name',
          label: 'Package(s)',
          tdClass: 'list-table-cell'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('build', ['getBuild']),
    build () {
      return this.getBuild(this.id)
    },

    output () {
      return (this.build && this.build.output) || (this.queue && this.queue.running.includes(this.id + '') && this.queue.output) || null
    }
  },
  beforeMount () {
    this.retrieveBuild(this.id)
    this.update()
  },
  methods: {
    ...mapActions('build', ['retrieveBuild']),
    update () {
      if (this.$route.name !== 'DetailsBuild') {
        return
      }
      setTimeout(() => {
        console.log('retrieve')
        this.retrieveBuild(this.id)
        this.update()
      }, 1000)
    }
  }
}
</script>

<style scoped>
#package-table {
  background-color: grey;
  color: red;
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
  color: var(--primary);
  font-weight: bold;
  padding: 14px;
  font-size: 16px;
}

</style>
