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

      <!-- error handling -->
      <div v-if="getBuildLoadings.get" class="loading">
        Retrieving the build's data...
      </div>
      <div v-if="getBuildErrors.get" class="build-error">
        <p>An error occurred during while retrieving build #{{ id }}</p>
        <p>{{ getBuildErrors.get }}</p>
      </div>
      <div v-else-if="!getSocket.isConnected" class="build-error">
        <p v-if="getSocket.error">{{ getSocket.error }}</p>
        <p v-if="getSocket.reconnectCount">Trying to reconnect... {{ getSocket.reconnectCount }}</p>
        <button v-if="getSocket.reconnectCount === 6" @click="$router.go()">Refresh</button>
      </div>

      <table id="date-table" class="table b-table table-striped">
        <thead class="list-thead">
          <tr>
            <!-- TODO: indicate duration -->
            <th>Id</th>
            <th>State</th>
            <th>Exit Status</th>
            <th>Creation Date</th>
            <th>Starting Date</th>
            <th>Finish date</th>
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
    return {}
  },
  computed: {
    ...mapGetters('build', ['getBuild', 'getBuildLoadings', 'getBuildErrors']),
    ...mapGetters(['getSocket']),
    _id () {
      return Number(this.id) || this.id
    },
    build () {
      return this.getBuild(this._id)
    },
    packages () {
      return (this.build && this.build.packages && this.build.packages.length) || []
    }
  },
  beforeMount () {
    this.retrieveBuild(this._id)
    // Connect WebSocket
    this.$connect()
  },
  beforeDestroy () {
    // Disconnect WebSocket
    this.$disconnect()
  },
  methods: {
    ...mapActions('build', ['retrieveBuild'])
  }
}
</script>

<style scoped>

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
