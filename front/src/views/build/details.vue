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

      <table id="date-table" class="table b-table table-striped">
        <thead class="list-thead">
          <tr>
            <th>Id</th>
            <th>State</th>
            <th>exit_status</th>
            <th>creation date</th>
            <th>start date</th>
            <th>end at</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-row-nohover">
            <td class="list-table-cell">{{ build && build.id }}</td>
            <td class="list-table-cell">{{ build && build.state }}</td>
            <td class="list-table-cell">{{ (build && build.exit_status) || '-' }}</td>
            <td class="list-table-cell">{{ build && build.creation_date }}</td>
            <td class="list-table-cell">{{ (build && build.start_date) || '-' }}</td>
            <td class="list-table-cell">{{ (build && build.end_date) || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <table id="packages-table" class="table b-table table-striped">
        <thead class="list-thead">
          <tr>
            <th>Packages</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-row-nohover">
            <div v-for="(pkg, index) in build && build.packages" :key="index">
              <td>
                <a :href="pkg">{{ pkg }}</a>
              </td>
            </div>
          </tr>
        </tbody>
      </table>

      <div class="manifest-space">
        <div class="manifest-thead">Output</div>
        <prism language="python">{{ build && build.stdout }}</prism>
        <div class="manifest-thead">Error</div>
        <prism language="python">{{ build && build.stderr }}</prism>
      </div>
      <!--
      <div>
        <h3>Output</h3>

        <code>{{ build && build.stdout }}</code>
      </div>
      <div>
        <h4>Error</h4>
        <code>{{ build && build.stderr }}</code>
      </div>
    -->
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
      successCompilation: null,
      queue: null,
      name: '',
      created_at: '',
      started_at: '',
      ended_at: '',
      state: 0,
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
    packages () {
      return (this.build && this.build.packages && this.build.packages.length && this.build.packages) || []
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
.list-table-cell {
  color: black;
}

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
  color: var(--white);
  font-weight: bold;
  padding: 14px;
  font-size: 16px;
}

</style>
