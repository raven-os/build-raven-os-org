<template>
  <div id="create_build">
    <!--==========================
    Section Create
    ============================-->
    <section id="create-build">
      <b-container>
        <!-- Create Build section -->
        <h1>Creation</h1>
        <!-- Error handling -->
        <p v-if="errorCreation" class="build-error">{{ errorCreation }}</p>
        <p v-if="successCreation" class="build-error">The build has been successfully added!</p>

        <form id="form-create" @submit.prevent="addBuild()">
          <b-container>
            <b-row class="m-2">
              <b-col>
                <b-input-group class="search-input-group create-input-group">
                  <b-input-group-prepend>
                    <div class="input-prepend">Name</div>
                  </b-input-group-prepend>
                  <input id="name" v-model="name" class="form-control create-input" type="text" placeholder="Manifest name">
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <b-col>
                <b-input-group class="search-input-group create-input-group">
                  <b-input-group-prepend>
                    <div class="input-prepend" style="background:grey;">Package id</div>
                  </b-input-group-prepend>
                  <input
                    id="package_id" v-model="package_id" class="form-control create-input" type="text"
                    placeholder="Package id"
                    readonly="true">
                </b-input-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div class="manifest-explain">Select a file or write manually the manifest</div>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <b-col>
                <b-file :state="isValidImport" class="file-import" placeholder="Browse or drag and drop a manifest" @change="readFile"/>
                <span v-if="isValidImport === false">Invalid file, must be a python file</span>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <AceEditor
                :font-size="14"
                :show-print-margin="true"
                :show-gutter="true"
                :highlight-active-line="true"
                :on-change="onChange"
                :editor-props="{$blockScrolling: true}"
                mode="python"
                theme="tomorrow_night"
                name="editor"
                width="100%"
                class-name="code-editor"/>
            </b-row>
            <b-row>
              <button class="create-add" type="submit">Add build</button>
            </b-row>
          </b-container>
        </form>
      </b-container>
    </section>
  </div>
</template>

<script>
// import brace from 'brace'
import { Ace as AceEditor, Split as SplitEditor } from 'vue2-brace-editor'
import uuidv4 from 'uuid/v4'

export default {
  components: {
    AceEditor,
    SplitEditor
  },
  data () {
    return {
      results: {
        creation: { loading: false, error: null, data: [], success: false },
        compilation: { loading: false, error: null, success: '' }
      },
      file: null,
      name: null,
      manifest: null,
      package_id: null
    }
  },
  computed: {
    isValidImport () {
      return this.file ? this.file.type === 'text/x-python' : null
    },
    loadingCreation () {
      return this.results.creation.loading
    },
    errorCreation () {
      return this.results.creation.error
    },
    successCreation () {
      return this.results.creation.success
    },
    loadingCompilation () {
      return this.results.compilation.loading
    },
    errorCompilation () {
      return this.results.compilation.error || ''
    },
    successCompilation () {
      return this.results.compilation.success
    }
  },
  methods: {
    readFile (event) {
      this.file = event.target.files[0]

      if (!this.isValidImport) {
        this.file = null
        return
      }
      const reader = new FileReader()

      this.name = this.file.name
      reader.onload = function (fileLoadedEvent) {
        this.manifest = fileLoadedEvent.target.result
        this.getPackageId()
      }.bind(this)
      reader.readAsText(this.file, 'UTF-8')
    },
    getPackageId () {
      const idRegex = /@package\s*\(\s*id\s*=\s*"(.*)"/g

      const match = idRegex.exec(this.manifest)
      this.package_id = (match && match[1]) || null
    },
    addCompileOutput (txt) {
      this.results.compilation.success += txt
    },
    build () {
      if (!this.results.compilation.loading) {
        this.results.compilation.sucess = ' '
        var ws = new WebSocket('ws://127.0.0.1:2794', ['rust-websocket'])
        ws.vue = this
        ws.onmessage = function (e) {
          this.vue.addCompileOutput(e.data)
        }
        const uid = uuidv4()
        ws.onopen = function () {
          ws.send('.packager.compile.client ' + uid)
        }
        this.results.compilation.error = null
        this.results.compilation.loading = true
        const headers = {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        this.$http.post('http://127.0.0.1:8000/packages/compile/' + uid, null, headers).then(res => {
          this.results.compilation.success = res.body
          this.results.compilation.loading = false
        }, err => {
          console.log(err)
          this.results.compilation.loading = false
          this.results.compilation.success = err
          this.results.compilation.error = err
        })
      }
    },
    addBuild () {
      console.log(this.manifest)
      if (!this.name || !this.manifest) {
        this.results.creation.error = 'You must complete all fields.'
        return
      }
      this.results.creation.error = null
      this.results.creation.loading = true
      const data = {
        manifest: this.manifest,
        name: this.name
      }
      this.$http.post('http://localhost:8000/builds/', data).then(res => {
        this.results.creation.data = res.body
        this.results.creation.loading = false
        this.results.creation.success = true
        // this.getPackages()
      }, err => {
        // console.log(err)
        this.results.creation.loading = false
        this.results.creation.error = err.body.error_description
        this.results.creation.success = false
      })
    },
    onChange (newValue) {
      this.manifest = newValue
    }
  }
}
</script>

<style scoped>

/* CREATE-BUILD
----------------------------------- */
h2 {
  text-align: center;
  margin: 25px 0px;
}

#create-build {
  margin-top: 200px;
}

#create-build h1 {
  text-align: center;
  font-size: 45px;
  margin-top: 50px;
  margin-bottom: 50px;
}

input[type="file"]:focus {
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 0, 0, 0.6);
}

#form-create {
  width: 100%;
}

#create-build .create-input-group {
  margin-bottom: 20px;
}

#create-build .input-prepend {
  font-family: sans-serif;
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  padding: 12px 28px;
  border-width: 1px 0px 1px 1px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--white);
  border-radius: 5px 0px 0px 5px;
  height: 50px;
  background: var(--accent);
  width: 150px;
  vertical-align: middle !important;
}

#create-build .create-input {
  font-family: sans-serif;
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  padding: 8px 28px;
  border-width: 1px 1px 1px 0px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--primary-dark);
  background: rgba(247, 244, 248, 0.7);
  border-radius: 0px 5px 5px 0px;
  height: 50px;
}

#create-build .create-add {
  font-family: sans-serif;
  font-size: 16px;
  padding: 8px 18px;
  border-width: 1px;
  border-style: solid;
  border-color: var(--primary-dark);
  color: var(--white);
  border-radius: 5px;
  height: 50px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: var(--accent);
  width: 150px;
  display: block;
  margin: 0 auto;
}

.form-control:focus {
  border-color: transparent;
  box-shadow: none;
  outline: -webkit-focus-ring-color auto 0px;
}

.manifest-explain {
  text-align: center;
  font-size: 20px;
  margin-top: 50px;
}

.file-import {
  margin-top: 30px;
}

.code-editor {
  margin-top: 50px;
  margin-bottom: 50px;
}

/* BUILD-ERROR
----------------------------------- */
.build-error {
  text-align: center;
  margin-bottom: 25px;
  color: var(--accent);
}
</style>
