<template>
  <div id="create_build">
    <!--==========================
    Section Create
    ============================-->
    <section id="create-build">
      <b-container>
        <!-- Create Build section -->
        <h1>Update manifest</h1>
        <!-- Error handling -->
        <div v-if="getManifestLoadings.update" class="loading">
          updating the manifest...
        </div>
        <div v-if="error || getManifestErrors.update" class="build-error">
          <p>An error has occured during the update of the manifest</p>
          <p>{{ error || getManifestErrors.update }}</p>
        </div>
        <div v-if="manifestId" class="success">
          <p>Manifest successfully updated</p>
          <a :href="'/manifests/details/' + manifestId">
            <u>#{{ manifestId }}</u>
          </a>
        </div>

        <div v-if="getManifestLoadings.get" class="loading">
          loading
        </div>
        <div v-else-if="getManifestErrors.get" class="build-error">
          <p>An error has occured, please refresh or try again later</p>
          <p>{{ getManifestErrors.get }}</p>
        </div>

        <form id="form-create" @submit.prevent="update()">
          <b-container>
            <b-row class="m-2">
              <b-col>
                <b-input-group class="search-input-group create-input-group">
                  <b-input-group-prepend>
                    <div class="input-prepend">Name</div>
                  </b-input-group-prepend>
                  <input
                    id="name"
                    v-model="name"
                    disabled
                    class="form-control create-input"
                    style="background-color:#dddddd;"
                    type="text"
                    placeholder="Manifest name"
                  >
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <b-col>
                <div class="manifest-explain">Select a file or write the manifest</div>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <b-col>
                <b-file
                  ref="file-upload"
                  :state="isValidImport"
                  class="file-import"
                  placeholder="Browse or drag and drop a manifest"
                  @change="readFile"
                />
                <span v-if="isValidImport === false">Invalid file, must be a python file</span>
              </b-col>
            </b-row>
            <b-row class="m-2 my-4">
              <b-col>
                <Monaco
                  :change-throttle="500"
                  :code="code"
                  :options="options"
                  height="600"
                  language="python"
                  theme="vs-dark"
                  @mounted="onMounted"
                  @codeChange="onChange"
                />
              </b-col>
            </b-row>
            <b-row>
              <button class="create-add" type="submit">Update</button>
            </b-row>
          </b-container>
        </form>
      </b-container>
    </section>
  </div>
</template>

<script>
import Monaco from 'monaco-editor-forvue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Monaco
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      code: '# Write your own manifest\n',
      options: {},
      file: null,
      name: null,
      manifest: null,
      manifestId: null,
      error: null
    }
  },
  computed: {
    ...mapGetters('manifest', ['getManifest', 'getManifestLoadings', 'getManifestErrors']),
    _id () {
      return Number(this.id) || this.id
    },
    isValidImport () {
      return this.file ? this.file.type === 'text/x-python' : null
    }
  },
  beforeMount () {
    this.retrieveManifest(this._id)
  },
  created () {
    const cb = () => {
      const _manifest = this.getManifest(this._id)
      if (!_manifest || !this.editor) {
        setTimeout(cb, 250)
      } else {
        this.name = _manifest.name
        this.manifest = this.content(_manifest)
        this.editor.setValue(this.manifest)
      }
    }

    setTimeout(cb, 250)
  },
  methods: {
    ...mapActions('manifest', ['retrieveManifest', 'updateManifest']),
    content (manifest) {
      const size = manifest && manifest.history && manifest.history.length
      if (Number(size)) {
        return manifest.history[size - 1].content
      }
      return null
    },
    readFile (event) {
      this.file = event.target.files[0]

      if (!this.isValidImport) {
        return
      }
      const reader = new FileReader()

      this.name = this.file.name
      reader.onload = function (fileLoadedEvent) {
        this.manifest = fileLoadedEvent.target.result
        this.editor.setValue(this.manifest)
      }.bind(this)
      reader.readAsText(this.file, 'UTF-8')
    },
    update () {
      this.error = null
      this.manifestId = null

      if (!this.manifest) {
        this.error = 'You must complete all fields.'
        return
      }

      const formerManifest = this.getManifest(this._id)
      if (this.content(formerManifest) === this.manifest) {
        this.error = "The manifest hasn't changed, you need to edit it"
        return
      }

      const data = {
        id: this._id,
        content: this.manifest
      }

      this.updateManifest(data).then(content => {
        this.manifestId = content && content.manifest_id
        this.file = null
        this.$refs['file-upload'].reset()
      })
    },
    onMounted (editor) {
      this.editor = editor
    },
    onChange (editor) {
      this.manifest = this.editor.getValue()
    }
  }
}
</script>

<style scoped>

.disabled {
  background-color: grey;
}
/* CREATE-BUILD
----------------------------------- */
.loading {
  color: blue;
  font-weight: bold;
  text-align: center;
  margin-bottom: 25px;
}

.success {
  color: green;
  font-weight: bold;
  text-align: center;
  margin-bottom: 25px;
}

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
