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
                </select>
              </b-input-group>
            </b-col>
            <b-col/>
          </b-row>
        </div>
      </b-container>
    </section>
  </div>
</template>

<script>
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
      manifests: []
    }
  },
  computed: {
  },
  watch: {
    query: 'search',
    field: 'search'
  },
  mounted () {
  },
  beforeMount () {
    this.getManifests()
  },
  methods: {
    search () {
      this.getManifests()
    },
    getManifests () {
    },
    onRowClick (item) {
      this.$router.push({name: 'DetailsManifest',
        params: {
          id: item.id.toString()
        }})
    },
    sortItems () {
      let items = this.manifests
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
