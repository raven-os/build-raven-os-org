<template>
  <div id="app">
    <!--==========================
    App - Search
    ============================-->
    <section id="builds-search">
      <b-container>
        <h1>Manifests</h1>
        <div class="search-zone">
          <b-row>
            <b-col/>
            <b-col cols="12" md="10">
              <b-input-group class="search-input-group">
                <input
                  ref="search"
                  v-model="query"
                  class="form-control search-input"
                  type="text"
                  placeholder="Search">
                <select slot="prepend" v-model="field" class="search-select">
                  <option value="name">Name</option>
                </select>
              </b-input-group>
            </b-col>
            <b-col/>
          </b-row>
        </div>
      </b-container>
    </section>

    <!-- error handling -->
    <div v-if="getManifestLoadings.list" class="loading">
      Retrieving the list of manifests...
    </div>
    <div v-if="getManifestErrors.list" class="build-error">
      <p>An error occurred while retrieving the list of manifests</p>
      <p>{{ getManifestErrors.list }}</p>
    </div>

    <!--==========================
    App - List
    ============================-->
    <section id="manifests-list">
      <b-container>
        <div class="builds-sort">
          <b-form-select
            v-model="selected"
            :options="optionSort"
            class="sort-select"
          />
        </div>

        <b-row>
          <b-col>
            <table class="table table-sm table-striped table-hover border">
              <tbody>
                <tr v-for="item in getManifests" :key="item.id" class="bg-light-accent-hover">
                  <td class="text-truncate text-white" style="width: 30%;">
                    <a :href="'/manifests/details/' + item.id" class="text-white">
                      <kbd><b>#{{ item.id }}: {{ item.name }}</b></kbd>
                    </a>
                  </td>
                  <td class="text-truncate text-right" style="width: 10%;">
                    <i class="far fa-calendar-alt mr-1"/>
                    {{ item.creation_date | momentFromNow }}
                  </td>
                </tr>
              </tbody>
            </table>
          </b-col>
        </b-row>
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
      return moment
        .utc(moment.duration(moment(end).diff(moment(start))).asMilliseconds())
        .format('HH:mm:ss')
    }
  },
  data () {
    return {
      query: '',
      field: 'name',
      page: 1,
      selected: { by: 'creation', desc: true },
      optionSort: [
        { text: 'From newest to oldest', value: { by: 'creation', desc: true } },
        { text: 'From oldest to newest', value: { by: 'creation', desc: false } },
        { text: 'From A to Z', value: { by: 'name', desc: false } },
        { text: 'From Z to A', value: { by: 'name', desc: true } }
      ]
    }
  },
  computed: {
    ...mapGetters('manifest', [
      'getManifests',
      'getManifestPagination',
      'getManifestLoadings',
      'getManifestErrors'
    ]),
    pageCount () {
      return (this.getManifestPagination && this.getManifestPagination.pageCount) || null
    },
    currentPage () {
      return (this.getManifestPagination && this.getManifestPagination.currentPage) || null
    }
  },
  watch: {
    query: 'search',
    field: 'search',
    selected: 'search',
    page: 'search'
  },
  beforeMount () {
    this.listManifests()
  },
  methods: {
    ...mapActions('manifest', ['listManifests']),
    search () {
      const params = {
        ...(this.query && { name: this.query }),
        sort: this.selected.by,
        dir: this.selected.desc ? 'desc' : 'asc',
        page: this.page
      }

      this.listManifests(params)
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
  color: var(--accent);
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

.search-input,
.search-input:focus {
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  padding: 8px 28px;
  border: 1px solid var(--primary-dark);
  color: var(--primary-dark);
  background: var(--white);
  border-radius: 0px 5px 5px 0px;
  height: 40px;
  box-shadow: none;
}

.search-select {
  font-size: 16px;
  display: inline-block;
  padding-left: 10px;
  border-width: 1px 0px 1px 1px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--white);
  border-radius: 5px 0px 0px 5px;
  height: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: var(--accent)
    url("https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_down_48px-128.png")
    no-repeat;
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

.sort-select,
.sort-select:focus {
  font-size: 16px;
  display: inline-block;
  padding-left: 10px;
  border: 1px solid var(--accent);
  color: var(--white);
  border-radius: 5px;
  height: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: var(--light-accent)
    url("https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_down_48px-128.png")
    no-repeat;
  background-size: 20px;
  background-position: right 10px center;
  box-shadow: none;
}

/* MANIFESTS-LIST
----------------------------------- */
#manifests-list {
  margin-top: 75px;
}
</style>
