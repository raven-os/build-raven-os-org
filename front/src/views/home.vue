<template>
  <div id="app">
    <p>hello</p>
    <!--==========================
    App - Search
    ============================-->
    <section id="builds-search">
      <b-container>
        <h1>Builds</h1>
        <div class="container search-zone">
          <b-row>
            <b-col/>
            <b-col cols="12" md="10">
              <b-input-group class="search-input-group">
                <input ref="search" v-model="query" class="form-control search-input" type="text" placeholder="Search">
                <select slot="prepend" v-model="field" class="search-select">
                  <option value="running">Running</option>
                  <option value="queuing">Queuing</option>
                  <option value="exit_status">Exit Status</option>
                  <option value="created_at">Creation date</option>
                </select>
              </b-input-group>
            </b-col>
            <b-col/>
          </b-row>
          <b-row>
            <b-col cols="0" md ="0" lg="1"></b-col>
            <b-col cols="12" md="2" lg="2">
              <div class="sort-title">Sort by</div>
            </b-col>
            <b-col cols="6" md="2" lg="2">
              <label class="custom-radio" for="running">Running
                <input id="running" v-model="sort" type="radio" value="running">
                <span class="checkmark"/>
              </label>
            </b-col>
            <b-col cols="6" md="2" lg="2">
              <label class="custom-radio" for="queuing">Queuing
                <input id="queuing" v-model="sort" type="radio" value="queuing">
                <span class="checkmark"/>
              </label>
            </b-col>
            <b-col cols="6" md="3" lg="2">
              <label class="custom-radio" for="exit_status">Exit Status
                <input id="exit_status" v-model="sort" type="radio" value="exit_status">
                <span class="checkmark"/>
              </label>
            </b-col>
            <b-col cols="6" md="3" lg="2">
              <label class="custom-radio" for="created_at">Creation date
                <input id="created_at" v-model="sort" type="radio" value="created_at">
                <span class="checkmark"/>
              </label>
            </b-col>
            <b-col cols="0" lg="1"></b-col>
          </b-row>
        </div>
      </b-container>
    </section>

    <!--==========================
    App - List
    ============================-->
    <section id="builds-list">
      <b-container>
        <!-- Error handling -->
        <div v-if="loadingBuild || errorBuild">
          <p v-if="errorBuild">{{ errorBuild }}</p>
          <p v-if="loadingBuild">loading...</p>
        </div>

        <!-- Nothing found -->
        <div v-else-if="builds.length <= 0">
          <p class="build-list-error">
            <b>No builds found</b>
          </p>
        </div>

        <!-- Display builds -->
        <div v-else>
          <table class="builds-list-table">
            <thead>
              <tr>
                <!-- <th>Id</th> -->
                <th class="list-table-cell">Id</th>
                <th class="list-table-cell">Manifest (10 first letters)</th>
                <th class="list-table-cell">Running</th>
                <th class="list-table-cell">Queuing</th>
                <th class="list-table-cell">Creation Date</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="build in builds">
                <tr :key="build.id">
                  <!-- <td>{{ pkg.id }}</td> -->
                  <td id="td-id" class="list-table-cell">{{ build.id }}</td>
                  <td id="td-manifest" class="list-table-cell">{{ build.manifest.substring(0, 10) }}</td>
                  <td id="td-running" class="list-table-cell">{{ build.running }}</td>
                  <td id="td-queuing" class="list-table-cell">{{ build.queuing }}</td>
                  <td id="td-date" class="list-table-cell">{{ build.created_at }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </b-container>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      field: 'created_at',
      sort: '',
      results: {
        builds: {loading: false, error: null, data: []}
      }
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
    }
  },
  watch: {
    query: 'search',
    field: 'search',
    sort: 'getBuilds'
  },
  beforeMount () {
    this.getBuilds()
  },
  methods: {
    search () {
      this.getBuilds()
    },
    getBuilds () {
      let url = 'http://localhost:8080/builds/'
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
    }
  }
  /*
  mounted () {
  this.$refs.search.focus()
}
*/
}
</script>

<style scoped>
/* PACKAGES-SEARCH
----------------------------------- */
#builds-search {
  margin-top: 150px;
}

#builds-search h1 {
  text-align: center;
  font-size: 45px;
  margin-top: 50px;
}

#builds-search .search-zone {
  padding: 10px;
}

#builds-search .search-input-group {
  margin: 0 auto;
}

#builds-search .search-input {
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

#builds-search .search-select {
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

#builds-search .sort-title {
  text-align: center;
  font-size: 18px;
  margin-top: 15px;
}

#builds-search .search-sort {
  display: inline-block;
  margin-top: 15px;
}

/* The custom-radio */
.custom-radio {
  display: inline-block;
  position: relative;
  padding-left: 25px;
  /* margin-right: 12px; */
  cursor: pointer;
  font-size: 12px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin-top: 17px;
}

/* Hide the browser's default radio button */
.custom-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 15px;
  width: 15px;
  background-color: var(--primary-dark);
  border-radius: 50%;
}

/* On mouse-over, add a grey background color */
.custom-radio:hover input ~ .checkmark {
  background-color: var(--accent);
}

/* When the radio button is checked, add a blue background */
.custom-radio input:checked ~ .checkmark {
  background-color: var(--accent);
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.custom-radio input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.custom-radio .checkmark:after {
  top: 5px;
  left: 5px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: white;
}

/* BUILDS-LIST
----------------------------------- */
.build-list-error {
  text-align: center;
  margin-top: 50px;
  font-weight: bold;
}

#builds-list {
  margin-top: 50px;
}

#builds-list .packages-list-table {
  padding: 10px;
  border-spacing: 10px;
  width: 100%;
  margin-top: 40px;
  height: 100%;
}

#builds-list .packages-list-table .list-table-cell {
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 10px;
}

#td-id,
#td-date {
  width: 20%;
}

#td-manifest {
  width: 25%;
}
</style>
