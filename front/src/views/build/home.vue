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
            <b-col />
            <b-col
              cols="12"
              md="10"
            >
              <b-input-group
                class="custom-input-group"
              >
                <input
                  ref="search"
                  v-model="query"
                  class="form-control custom-input"
                  type="text"
                  placeholder="Search"
                >
                <select
                  slot="prepend"
                  v-model="field"
                  class="custom-accent-select"
                >
                  <option value="manifest_id">
                    Manifest Id
                  </option>
                  <option value="exit_status">
                    Exit Status
                  </option>
                </select>
              </b-input-group>
            </b-col>
            <b-col />
          </b-row>
        </div>
      </b-container>
    </section>

    <!-- error handling -->
    <div v-if="getBuildLoadings.list" class="text-loading">
      Looking for builds...
    </div>
    <div v-if="getBuildErrors.list" class="text-error">
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
            class="custom-light-accent-select"
            @change="true"
          />
        </div>

        <b-row>
          <b-col>
            <table class="table table-sm table-striped table-hover border">
              <tbody>
                <tr
                  v-for="item in getBuilds" :key="item.id"
                  :class="{ queued: item.state == STATE.QUEUING, running: item.state == STATE.RUNNING, failed: item.state == STATE.FINISHED && item.exit_status != 0, success: item.state == STATE.FINISHED && item.exit_status == 0 }"
                  class="bg-light-accent-hover build-item"
                >
                  <td class="text-center" width="5%">
                    <div v-if="item.state === STATE.FINISHED && item.exit_status == 0">
                      <i class="fas fa-check text-success" />
                    </div>
                    <div v-else-if="item.state === STATE.FINISHED && item.exit_status != 0">
                      <i class="fas fa-times text-failed" />
                    </div>
                    <div v-else-if="item.state === STATE.RUNNING">
                      <i class="fas fa-bolt text-running" />
                    </div>
                    <div v-else-if="item.state === STATE.QUEUING">
                      <i class="fas fa-history text-queued" />
                    </div>
                  </td>
                  <td class="text-truncate" width="10%">
                    <a :href="'/builds/details/' + item.id">
                      <kbd><b>#{{ item.id }}</b></kbd>
                    </a>
                  </td>
                  <td class="text-truncate item-pkg" width="50%">
                    Package(s):
                    <span v-if="item.packages && item.packages.length">
                      <span v-for="(pkgItem, index) in item.packages" :key="index">
                        <span v-if="index > 0">;</span> {{ item.repository }}/{{ pkgItem }}
                      </span>
                    </span>
                    <span v-else>None</span>
                  </td>
                  <td class="text-truncate text-left" width="10%">
                    <i class="far fa-calendar-alt" /> {{ item.creation_date | momentFromNow }}
                    <div v-if="item.start_date && item.end_date">
                      <i class="far fa-clock" /> {{ item.start_date | momentDuration(item.end_date) }}
                    </div>
                    <div v-else-if="item.start_date && !item.end_date">
                      <i class="far fa-clock" /> Running since {{ item.start_date | momentFromNow }}
                    </div>
                    <div v-else>
                      <i class="far fa-clock" /> Queued
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </b-col>
        </b-row>
        <!-- Pagination -->
        <b-row>
          <b-col class="text-center">
            <div style="display: inline-block">
              <paginate
                v-model="currentPage"
                :page-count="pageCount"
                :page-range="3"
                :margin-pages="2"
                :click-handler="clickCallback"
                :prev-text="'<'"
                :next-text="'>'"
                :first-button-text="'«'"
                :last-button-text="'»'"
                :container-class="'pagination'"
                :page-class="'pagination-item'"
                :active-class="'current-page'"
                first-last-button
              />
            </div>
          </b-col>
        </b-row>
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
      ],
      currentPage: 0
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
      return (this.getBuildPagination && this.getBuildPagination.pageCount) || 0
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
    },
    clickCallback (newPage) {
      this.page = newPage
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

/* BUILDS-LIST
----------------------------------- */
#builds-list {
  margin-top: 75px;
}

.build-item:hover i,
.build-item:hover .item-pkg {
  color: var(--white) !important;
}

.running {
  border-left: 15px solid #FFC30B;
}
.text-running {
  color: #FFC30B;
  width: 20px;
}

.queued {
  border-left: 15px solid #2E77BB;
}
.text-queued {
  color: #2E77BB;
  width: 20px;
}

.failed {
  border-left: 15px solid #E74F4E;
}
.text-failed {
  color: #E74F4E;
  width: 20px;
}

.success {
  border-left: 15px solid #85CD3F;
}
.text-success {
  color: #85CD3F;
  width: 20px;
}

.item-pkg {
  font-style: italic;
  font-size: 15px;
}

</style>
