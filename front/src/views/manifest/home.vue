<template>
  <div id="app">
    <!--==========================
    App - Search
    ============================-->
    <section id="section-home">
      <b-container>
        <h1>Manifests</h1>
        <div class="mt-5">
          <b-row>
            <b-col />
            <b-col cols="12" md="10">
              <b-input-group class="custom-input-group">
                <input
                  ref="search"
                  v-model="query"
                  class="form-control custom-input"
                  type="text"
                  placeholder="Search"
                >
                <select slot="prepend" v-model="field" class="custom-accent-select">
                  <option value="name">
                    Name
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
    <div v-if="getManifestLoadings.list" class="text-loading">
      Retrieving the list of manifests...
    </div>
    <div v-if="getManifestErrors.list" class="text-error">
      <p>An error occurred while retrieving the list of manifests</p>
      <p>{{ getManifestErrors.list }}</p>
    </div>

    <div v-if="getBuildLoadings.create" class="text-loading">
      Adding the build...
    </div>
    <div v-if="getBuildErrors.create" class="text-error">
      <p>An error occurred preventing the creation of the build</p>
      <p>{{ getBuildErrors.create }}</p>
    </div>
    <div v-if="buildId" class="text-success">
      <p>Build successfully created</p>
      <a :href="'/builds/details/' + buildId">
        <u>#{{ buildId }}</u>
      </a>
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
            class="custom-light-accent-select"
          />
        </div>

        <b-row>
          <b-col>
            <table class="table table-sm table-striped table-hover border">
              <tbody>
                <tr v-for="item in getManifests" :key="item.id" class="bg-light-accent-hover">
                  <td style="width: 2%;">
                    <div class="custom-control form-control-lg custom-checkbox" style="height: 15px; margin-top: -5px;">
                      <input
                        :id="item.id"
                        v-model="checkedManifests"
                        :value="item.id"
                        type="checkbox"
                        :disabled="!(isAdmin || isMaintainer(item))"
                        class="custom-control-input"
                      >
                      <label class="custom-control-label" :for="item.id" />
                    </div>
                  </td>
                  <td class="text-truncate text-white" style="width: 30%;">
                    <a :href="'/manifests/details/' + item.id" class="text-white">
                      <kbd><b>#{{ item.id }}: {{ item.name }}</b></kbd>
                    </a>
                  </td>
                  <td class="text-truncate text-right" style="width: 10%;">
                    <i class="far fa-calendar-alt mr-1" />
                    {{ item.creation_date | momentFromNow }}
                  </td>
                </tr>
              </tbody>
            </table>
          </b-col>
        </b-row>

        <b-row v-if="checkedManifests.length">
          <button class="custom-button" @click.prevent="build()">
            Build
          </button>
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
      ],
      checkedManifests: [],
      buildId: null
    }
  },
  computed: {
    ...mapGetters('manifest', [
      'getManifests',
      'getManifestPagination',
      'getManifestLoadings',
      'getManifestErrors'
    ]),
    ...mapGetters('build', ['getBuildLoadings', 'getBuildErrors']),
    ...mapGetters('auth', ['getAuthUser']),
    pageCount () {
      return (this.getManifestPagination && this.getManifestPagination.pageCount) || null
    },
    currentPage () {
      return (this.getManifestPagination && this.getManifestPagination.currentPage) || null
    },
    isAdmin () {
      return this.getAuthUser.rights && this.getAuthUser.rights.includes('admin')
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
    ...mapActions('build', ['createBuild']),
    search () {
      const params = {
        ...(this.query && { name: this.query }),
        sort: this.selected.by,
        dir: this.selected.desc ? 'desc' : 'asc',
        page: this.page
      }

      this.listManifests(params)
    },
    clickCallback (newPage) {
      this.page = newPage
    },
    build () {
      this.buildId = null

      this.createBuild(this.checkedManifests).then(build => {
        this.buildId = build && build.id
        this.checkedManifests = []
      })
    },
    isMaintainer (manifest) {
      return manifest && manifest.maintainer === this.getAuthUser.id
    }
  }
}
</script>

<style scoped>
/* SECTION HOME
----------------------------------- */
#section-home {
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

/* MANIFESTS-LIST
----------------------------------- */
#manifests-list {
  margin-top: 75px;
}
</style>
