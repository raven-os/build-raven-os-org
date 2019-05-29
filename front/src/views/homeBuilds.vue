<template>
  <div id="app">
    <!--==========================
    App - Search
    ============================-->
    <section id="builds-search">
      <b-container>
        <h1>Builds</h1>
        <div class="search-zone">
          <b-row>
            <b-col/>
            <b-col
              cols="12"
              md="10">
              <b-input-group
                class="search-input-group">
                <input
                  ref="search"
                  v-model="query"
                  class="form-control search-input"
                  type="text"
                  placeholder="Search">
                <select
                  slot="prepend"
                  v-model="field"
                  class="search-select">
                  <option value="running">Running</option>
                  <option value="queuing">Queuing</option>
                  <option value="exit_status">Exit Status</option>
                  <option value="created_at">Creation date</option>
                </select>
              </b-input-group>
            </b-col>
            <b-col/>
          </b-row>
        </div>
      </b-container>
    </section>

    <!--==========================
    App - List
    ============================-->
    <section id="builds-list">
      <b-container>
        <div class="builds-sort">
          <b-form-select
            v-model="selected"
            :options="optionSort"
            class="sort-select"
            @change="onSortChange"/>
        </div>
        <div
          v-for="item in sortItems()"
          :class="{ queued: item.state == 0, running: item.state == 1, failed: item.state == 2, success: item.state == 3 }"
          :key="item.id"
          class="build-item">
          <a :href="'/builds/details/' + item.id" class="item-desc">
          <b-container>
            <b-row>
              <b-col>
                <div class="item-info">
                  <div v-if="item.state === 3">
                    <i class="fas fa-check text-success"/> <span class="item-name">{{ item.name }}</span>
                  </div>
                  <div v-else-if="item.state === 2">
                    <i class="fas fa-times text-failed"/> <span class="item-name">{{ item.name }}</span>
                  </div>
                  <div v-else-if="item.state === 1">
                    <i class="fas fa-bolt text-running"/> <span class="item-name">{{ item.name }}</span>
                  </div>
                  <div v-else>
                    <i class="fas fa-history text-queued"/> <span class="item-name">{{ item.name }}</span>
                  </div>
                  <div class="item-pkg">
                    Package(s): <span v-for="(pkgItem, index) in getPkgs(item)" :key="pkgItem"><span v-if="index > 0">;</span> {{ item.repository }}/{{ pkgItem }}
                    </span>
                  </div>
                </div>
              </b-col>
              <b-col cols="12" md="4" lg="2">
                <div class="item-date">
                  <i class="far fa-calendar-alt"/> {{ item.created_at | momentFromNow }}
                  <div v-if="item.started_at && item.ended_at">
                    <i class="far fa-clock"/> {{ item.started_at | momentDuration(item.ended_at) }}
                  </div>
                  <div v-else-if="item.started_at && !item.ended_at">
                    <i class="far fa-clock"/> Running since {{ item.started_at | momentFromNow }}
                  </div>
                  <div v-else>
                    <i class="far fa-clock"/> Queued
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-container>
          </a>
        </div>
      </b-container>
    </section>
  </div>
</template>

<script>
const builds = [
  { id: 1, name: 'Htop', state: 2, created_at: '2018-06-15T11:45:30Z', started_at: '2018-06-15T11:45:35Z', ended_at: '2018-06-15T11:45:40Z', repository: 'stable', packages: 'htop' },
  { id: 2, name: 'Browsers', state: 3, created_at: '2018-10-23T11:45:30Z', started_at: '2018-10-23T11:50:30Z', ended_at: '2018-10-23T11:56:12Z', repository: 'stable', packages: 'firefox,chrome' },
  { id: 3, name: 'Test', state: 0, created_at: '2018-10-02T11:45:30Z', started_at: '', ended_at: '', repository: 'stable', packages: 'test' },
  { id: 4, name: 'Discord', state: 1, created_at: '2018-10-24T11:45:30Z', started_at: '2018-10-24T12:45:30Z', ended_at: '', repository: 'stable', packages: 'discord' }
]

const runningItems = [
  { id: 4, name: 'Manifest 1', state: 1, created_at: '2018-06-15T11:45:30Z', started_at: '', ended_at: '' }
]

export default {
  filters: {
    momentFromNow: function (date) {
      return moment(date).fromNow()
    },
    momentDuration: function (start, end) {
      return moment.utc(moment.duration(moment(end).diff(moment(start))).asMilliseconds()).format('HH:mm:ss')
    }
  },
  data () {
    return {
      query: '',
      field: 'created_at',
      sort: '',
      results: {
        builds: { loading: false, error: null, data: [] }
      },
      queue: null,
      sortBy: 'created_at',
      sortDesc: true,
      selected: { by: 'created_at', desc: true },
      optionSort: [
        { text: 'From newest to oldest', value: { by: 'created_at', desc: true } },
        { text: 'From oldest to newest', value: { by: 'created_at', desc: false } },
        { text: 'From A to Z', value: { by: 'name', desc: false } },
        { text: 'From Z to A', value: { by: 'name', desc: true } }
      ],
      runningItems: runningItems
    }
  },
  computed: {
    loadingBuild () {
      return this.results.builds.loading
    },
    errorBuild () {
      return this.results.builds.error
    },
    builds () {
      return this.results.builds.data
    },
    queuing () {
      return (this.queue && this.queue.queuing) || null
    },
    running () {
      return (this.queue && this.queue.running) || null
    }
  },
  watch: {
    query: 'search',
    field: 'search'
  },
  mounted () {
    window.ws = new WebSocket('ws://127.0.0.1:2794', ['rust-websocket'])
    window.ws.vue = this
    window.ws.onmessage = function (e) {
      const json = e.data.replace(/[^\x20-\x7E]/g, '\\n')
      console.log(json)
      this.vue.queue = JSON.parse(json)
      console.log(this.vue.queue)
    }
    window.ws.onopen = function () {
      window.ws.send('.packager.compile.client 1')
    }
  },
  beforeMount () {
    this.getBuilds()
  },
  methods: {
    runQueue () {
      this.$http.post('http://localhost:8000/queue/run')
    },
    search () {
      this.getBuilds()
    },
    getBuilds () {
      let url = 'http://localhost:8000/builds/'
      if (this.query) {
        url += `?${this.field}=${this.query}`
      }
      if (this.sort) {
        url += this.query ? '&' : '?'
        url += `order_by=${this.sort}`
      }
      this.results.builds.error = null
      this.results.builds.loading = true
      this.$http.get(url).then(res => {
        this.results.builds.data = res.body
        this.results.builds.loading = false
      }, err => {
        console.log(err)
        this.results.builds.loading = false
        this.results.builds.error = err.body.error_description
      })
    },
    onRowClick (item) {
      // this.$router.push({name: 'DetailsBuild',
      //   params: {
      //     id: item.id.toString(),
      //     name: item.name,
      //     created_at: item.created_at,
      //     state: item.state,
      //     started_at: item.started_at,
      //     ended_at: item.ended_at,
      //     packages: item.packages
      //   }})
    },
    sortItems () {
      let items = builds
      switch (this.sortBy) {
        case 'created_at':
          items.sort(function (a, b) {
            return moment(a['created_at']).diff(moment(b['created_at']))
          })
          break
        case 'name':
          items.sort(function (a, b) {
            return a['name'] > b['name']
          })
          break
      }
      if (this.sortDesc) {
        items.reverse()
      }
      return items
    },
    onSortChange (value) {
      this.sortBy = value['by']
      this.sortDesc = value['desc']
    },
    getPkgs (item) {
      return item.packages.split(',')
    }
  }
}
</script>

<style scoped>
/* BUILDS-SEARCH
----------------------------------- */
#builds-search {
  margin-top: 200px;
}

h1 {
  text-align: center;
  font-size: 45px;
}

.search-zone {
  padding: 10px;
}

.search-input-group {
  margin: 0 auto;
}

.search-input {
  font-family: sans-serif;
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  padding: 8px 28px;
  border-width: 1px 1px 1px 1px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--primary-dark);
  background: rgba(247, 244, 248, 0.7);
  border-radius: 0px 5px 5px 0px;
  height: 50px;
}
.search-input:focus {
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 0, 0, 0.6);
}

.search-select {
  font-family: sans-serif;
  font-size: 16px;
  display: inline-block;
  padding-left: 10px;
  border-width: 1px 0px 1px 1px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--white);
  border-radius: 5px 0px 0px 5px;
  height: 50px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: var(--accent) url('https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_down_48px-128.png') no-repeat;
  background-size: 20px;
  background-position: right 10px center;
  width: 175px;
}

/* BUILDS-SORT
----------------------------------- */
.builds-sort {
  margin-bottom: 25px;
  width: 25%;
  margin-right: 0;
  margin-left: auto;
}

@media (max-width: 500px) {
  .builds-sort {
    width: 100%;
  }
}

.sort-select, .sort-select:focus {
  font-family: sans-serif;
  font-size: 16px;
  display: inline-block;
  padding-left: 10px;
  border-width: 1px 1px 1px 1px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--white);
  border-radius: 5px 5px 5px 5px;
  height: 50px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: var(--accent) url('https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_down_48px-128.png') no-repeat;
  background-size: 20px;
  background-position: right 10px center;
}

/* BUILDS-LIST
----------------------------------- */
#builds-list {
  margin-top: 75px;
}

.build-item {
  padding: 10px;
  border-bottom: 1px solid var(--primary-dark);
  border-top: 1px solid var(--primary-dark);
  border-right: 1px solid var(--primary-dark);
  margin-bottom: 5px;
}
.build-item:hover {
  background-color: rgba(237, 37, 78, 0.25) !important;
}

.item-desc,
.item-desc:hover {
  color: var(--primary-dark) !important;
}

.running {
  border-left: 15px solid #FFC30B;
}
.text-running {
  color: #FFC30B;
  margin-right: 10px;
  width: 20px;
}

.queued {
  border-left: 15px solid #2E77BB;
}
.text-queued {
  color: #2E77BB;
  margin-right: 10px;
  width: 20px;
}

.failed {
  border-left: 15px solid #E74F4E;
}
.text-failed {
  color: #E74F4E;
  margin-right: 10px;
  width: 20px;
}

.success {
  border-left: 15px solid #85CD3F;
}
.text-success {
  color: #85CD3F;
  margin-right: 10px;
  width: 20px;
}

.item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-size: 20px;
}

.item-pkg {
  font-style: italic;
  font-size: 15px;
  margin-top: 5px;
}

.item-date {
  text-align: left;
}
</style>
