<template>
  <div id="create_build">
    <!--==========================
    Section Create
    ============================-->
    <section id="create-build">
      <b-container>
        <!-- Create Build section -->
        <h1 class="my-4">
          Create manifest
        </h1>
        <!-- Error handling -->
        <div v-if="getManifestLoadings.create" class="text-loading">
          Creating the manifest...
        </div>
        <div v-if="error || getManifestErrors.create" class="text-error">
          <p>An error occurred while creating the manifest</p>
          <p>{{ error || getManifestErrors.create }}</p>
        </div>
        <div v-if="manifestId" class="text-success">
          <p>Manifest successfully created</p>
          <a :href="'/manifests/details/' + manifestId">
            <u>#{{ manifestId }}</u>
          </a>
        </div>

        <form id="form-create" @submit.prevent="create()">
          <b-container>
            <b-row class="m-2">
              <b-col>
                <b-input-group class="custom-input-group">
                  <b-input-group-prepend class="custom-input-group-prepend">
                    Name
                  </b-input-group-prepend>
                  <input
                    id="name"
                    v-model="name"
                    class="form-control custom-input"
                    type="text"
                    placeholder="Manifest name"
                  >
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="m-2">
              <b-col>
                <div class="manifest-explain">
                  Select a file or write the manifest
                </div>
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
              <button class="custom-button" type="submit">
                Create
              </button>
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
    ...mapGetters('manifest', ['getManifestLoadings', 'getManifestErrors']),
    isValidImport () {
      return this.file ? this.file.type === 'text/x-python' : null
    }
  },
  methods: {
    ...mapActions('manifest', ['createManifest']),
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
    create () {
      this.error = null
      this.manifestId = null

      if (!this.name || !this.manifest) {
        this.error = 'You must complete all fields.'
        return
      }
      const data = {
        content: this.manifest,
        name: this.name
      }

      this.createManifest(data).then(manifest => {
        this.manifestId = manifest && manifest.id
        this.name = null
        this.file = null
        this.$refs['file-upload'].reset()
        this.editor.setValue(this.code)
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
/* CREATE-BUILD
----------------------------------- */
#create-build {
  margin-top: 200px;
}

input[type="file"]:focus {
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 0, 0, 0.6);
}

#form-create {
  width: 100%;
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
</style>
