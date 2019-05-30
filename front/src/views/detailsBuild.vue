<template>
  <div id="app">
    <b-container class="top-container">
      <b-row>
        <b-col>
          <div class="manifest-name">{{ name }}</div>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="mid-container">
      <b-table
        id="date-table"
        :items="dateProvider"
        :fields="dateFields"
        tbody-tr-class="table-row-nohover"
        thead-class="list-thead"
        responsive />
      <b-table
        id="packages-table"
        :items="pkgProvider"
        :fields="pkgFields"
        tbody-tr-class="table-row-nohover"
        thead-class="list-thead"
        responsive
        striped
        show-empty
        empty-text="No package for this manifest" />
      <div class="manifest-space">
        <div class="manifest-thead">Manifest</div>
        <prism language="python">{{ manifestBody }}</prism>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      build: null,
      successCompilation: null,
      queue: null,
      name: '',
      created_at: '',
      started_at: '',
      ended_at: '',
      state: 0,
      packages: '',
      manifestBody: manifest,
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
    manifest () {
      return (this.build && this.build.manifest) || null
    },
    queuing () {
      return (this.build && this.build.queuing) || (this.queue && this.queue.queuing && this.queue.queuing.includes(this.id + '')) || false
    },
    running () {
      return (this.build && this.build.running) || (this.queue && this.queue.running && this.queue.running.includes(this.id + '')) || false
    },
    output () {
      return (this.build && this.build.output) || (this.queue && this.queue.running.includes(this.id + '') && this.queue.output) || null
    }
  },
  created () {
    this.name = this.$route.params.name
    this.created_at = this.$route.params.created_at
    this.started_at = this.$route.params.started_at
    this.ended_at = this.$route.params.ended_at
    this.state = this.$route.params.state
    this.packages = this.$route.params.packages

    // WE NEED TO FETCH THE BUILD FROM THE DATABASE INSTEAD OF GETTING
    // ITS PARAMS FROM THE HOME VUE
  },
  mounted () {
    if (!window.ws) {
      window.ws = new WebSocket('ws://127.0.0.1:2794', ['rust-websocket'])
    }
    window.ws.vue = this
    window.ws.onmessage = function (e) {
      const json = e.data.replace(/[^\x20-\x7E]/g, '\\n')
      console.log(json)
      this.vue.queue = JSON.parse(json)
      console.log(this.vue.queue)
      if (this.vue.build.running && !this.vue.queue.running.includes(this.vue.id + '')) {
        this.vue.retrieve()
      }
    }
    this.retrieve()
  },
  methods: {
    retrieve () {
      this.$http.get('http://localhost:8000/builds/' + this.id).then(res => {
        this.build = res.body
        console.log(this.build)
      }, err => {
        console.error(err)
      })
    },
    addToQueue () {
      this.$http.post('http://localhost:8000/queue/', { name: this.id })
    },
    dateProvider (ctx) {
      let items = []
      var newItem = {
        created_at: this.created_at,
        state: this.state,
        started_at: this.started_at,
        ended_at: this.ended_at
      }
      items.push(newItem)
      return items
    },
    pkgProvider (ctx) {
      let items = []
      var split = this.packages.split(',')
      for (var i = 0; i < split.length; ++i) {
        var newItem = {
          name: split[i].charAt(0).toUpperCase() + split[i].slice(1)
        }
        items.push(newItem)
      }
      return items
    }
  }
}
</script>

<style scoped>
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
  color: var(--primary);
  font-weight: bold;
  padding: 14px;
  font-size: 16px;
}

</style>
