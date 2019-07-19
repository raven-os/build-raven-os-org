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
                  <option value="manifest_id">Manifest Id</option>
                  <option value="exit_status">Exit Status</option>
                </select>
              </b-input-group>
            </b-col>
            <b-col/>
          </b-row>
        </div>
      </b-container>
    </section>

    <!-- error handling -->
    <div v-if="getBuildLoadings.list" class="loading">
      Looking for builds...
    </div>
    <div v-if="getBuildErrors.list" class="build-error">
      <p>An error occurred while retrieving the list of builds</p>
      <p>{{ getBuildErrors.list }}</p>
    </div>

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
            @change="true"/>
        </div>
        <div
          v-for="item in getBuilds"
          :class="{ queued: item.state == STATE.QUEUING, running: item.state == STATE.RUNNING, failed: item.exit_status != 0, success: item.exit_status == 0 }"
          :key="item.id"
          class="build-item">
          <a :href="'/builds/details/' + item.id" class="item-desc">
            <b-container>
              <b-row>
                <b-col>
                  <div class="item-info">
                    <div v-if="item.state === STATE.FINISHED">
                      <i class="fas fa-check text-success"/> <span class="item-name">#{{ item.id }}</span>
                    </div>
                    <div v-else-if="item.exit_status !== 0">
                      <i class="fas fa-times text-failed"/> <span class="item-name">#{{ item.id }}</span>
                    </div>
                    <div v-else-if="item.state === STATE.RUNNING">
                      <i class="fas fa-bolt text-running"/> <span class="item-name">#{{ item.id }}</span>
                    </div>
                    <div v-else-if="item.state === STATE.QUEUING">
                      <i class="fas fa-history text-queued"/> <span class="item-name">#{{ item.id }}</span>
                    </div>
                    <div v-if="item.packages && item.packages.length" class="item-pkg">
                      Package(s): <span v-for="(pkgItem, index) in item.packages" :key="index"><span v-if="index > 0">;</span> {{ item.repository }}/{{ pkgItem }}
                      </span>
                    </div>
                  </div>
                </b-col>
                <b-col cols="12" md="4" lg="2">
                  <div class="item-date">
                    <i class="far fa-calendar-alt"/> {{ item.creation_date | momentFromNow }}
                    <div v-if="item.start_date && item.end_date">
                      <i class="far fa-clock"/> {{ item.start_date | momentDuration(item.end_date) }}
                    </div>
                    <div v-else-if="item.start_date && !item.end_date">
                      <i class="far fa-clock"/> Running since {{ item.start_date | momentFromNow }}
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

        <!-- Pagination -->
        <div class="pagination">
          <span v-for="n in pageCount" :key="n">
            <a :class="n === currentPage ? 'current' : ''" @click="page = n" >{{ n }}</a>
          </span>
        </div>
      </b-container>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

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
      page: 1,
      field: 'manifest_id',
      selected: { by: 'creation', desc: true },
      optionSort: [
        { text: 'From newest to oldest', value: { by: 'creation', desc: true } },
        { text: 'From oldest to newest', value: { by: 'creation', desc: false } }
      ]
    }
  },
  computed: {
    ...mapGetters('build', [
      'getBuilds',
      'getBuildPagination',
      'getBuildLoadings',
      'getBuildErrors'
    ]),
    STATE () {
      return {
        QUEUING: 'queuing',
        RUNNING: 'running',
        FINISHED: 'finished'
      }
    },
    builds () {
      return this.getBuilds
    },
    pageCount () {
      return (this.getBuildPagination && this.getBuildPagination.pageCount) || null
    },
    currentPage () {
      return (this.getBuildPagination && this.getBuildPagination.currentPage) || null
    }
  },
  watch: {
    query: 'search',
    field: 'search',
    selected: 'search',
    page: 'search'
  },
  beforeMount () {
    this.listBuilds()
  },
  methods: {
    ...mapActions('build', ['listBuilds']),
    search () {
      const params = {
        sort: this.selected.by,
        dir: this.selected.desc ? 'desc' : 'asc',
        page: this.page
      }

      if (this.field && this.query) {
        params[this.field] = this.query
      }

      this.listBuilds(params)
    }
  }
}
</script>

<style scoped>

.current {
  font-weight: bold;
}

.pagination  {
  margin-top: 1em;
  font-size: 1.2em;
}

.pagination a {
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
