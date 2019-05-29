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
    <section id="manifests-list">
      <b-container>
        <div class="builds-sort">
          <b-form-select
            v-model="selected"
            :options="optionSort"
            class="sort-select"
            @change="onSortChange"
          />
        </div>
        <div
          v-for="item in sortItems()"
          :key="item.id"
          class="build-item">
          <a :href="'/manifests/details/' + item.id" class="item-desc">
          <b-container>
            <b-row>
              <b-col>
                <div class="item-info">
                  {{ item.name }}
                </div>
              </b-col>
              <b-col cols="12" md="4" lg="2">
                <div class="item-date">
                  <i class="far fa-calendar-alt"/>
                  {{ item.created_at | momentFromNow }}
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
const manifests = [
  { id: 1, name: "Manifest 1", created_at: "2018-06-15T11:45:30Z", updated_at: "2018-06-15T11:45:35Z" },
  { id: 2, name: "Manifest 2", created_at: "2018-06-15T11:45:30Z", updated_at: "2018-06-15T11:45:35Z" }
];

export default {
  filters: {
    momentFromNow: function(date) {
      return moment(date).fromNow();
    },
    momentDuration: function(start, end) {
      return moment
        .utc(moment.duration(moment(end).diff(moment(start))).asMilliseconds())
        .format("HH:mm:ss");
    }
  },
  data() {
    return {
      query: '',
      field: 'created_at',
      sortBy: 'created_at',
      sortDesc: true,
      selected: { by: 'created_at', desc: true },
      optionSort: [
        { text: 'From newest to oldest', value: { by: 'created_at', desc: true } },
        { text: 'From oldest to newest', value: { by: 'created_at', desc: false } },
        { text: 'From A to Z', value: { by: 'name', desc: false } },
        { text: 'From Z to A', value: { by: 'name', desc: true } }
      ],
    };
  },
  computed: {},
  watch: {
    query: "search",
    field: "search"
  },
  mounted() {},
  beforeMount() {
    this.getManifests();
  },
  methods: {
    search() {
      this.getManifests();
    },
    getManifests() {
      return this.manifests
    },
    onRowClick(item) {
      // this.$router.push({
      //   name: "DetailsManifest",
      //   params: {
      //     id: item.id.toString(),
      //     name: item.name,
      //     created_at: item.created_at,
      //     updated_at: item.updated_at
      //   }
      // });
    },
    sortItems() {
      let items = manifests;
      switch (this.sortBy) {
        case "created_at":
          items.sort(function(a, b) {
            return moment(a["created_at"]).diff(moment(b["created_at"]));
          });
          break;
        case "name":
          items.sort(function(a, b) {
            return a["name"] > b["name"];
          });
          break;
      }
      if (this.sortDesc) {
        items.reverse();
      }
      return items;
    },
    onSortChange(value) {
      this.sortBy = value["by"];
      this.sortDesc = value["desc"];
    }
  }
};
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
  background: var(--accent)
    url("https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_down_48px-128.png")
    no-repeat;
  background-size: 20px;
  background-position: right 10px center;
}

/* MANIFESTS-LIST
----------------------------------- */
#manifests-list {
  margin-top: 75px;
}

.build-item {
  padding: 10px;
  border: 1px solid var(--primary-dark);
  margin-bottom: 5px;
}
.build-item:hover {
  background-color: rgba(237, 37, 78, 0.25) !important;
}

.item-desc,
.item-desc:hover {
  color: var(--primary-dark) !important;
}

.item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-size: 20px;
}

.item-date {
  text-align: left;
}
</style>
