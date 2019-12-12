const rp = require('request-promise')
const Buffer = require('./buffer')

class Communication {
  constructor (config) {
    this.config = config
    this.resource = this.config.build_api_url + 'build/'
    this.startEndpoint = '/start'
    this.stdoutEndpoint = '/stdout'
    this.stderrEndpoint = '/stderr'
    this.endEndpoint = '/end'
    this.packageEndpoint = '/packages'
    this.buffers = {}
  }

  _getBuffers (id) {
    if (!this.buffers[id]) {
      this.buffers[id] = {
        stdout: new Buffer(),
        stderr: new Buffer()
      }
    }

    return this.buffers[id]
  }

  async _req (uri, body) {
    const options = {
      method: 'PUT',
      uri,
      json: !!body,
      body: body || null,
      headers: {
        Authorization: this.config.apikeys.build
      }
    }

    try {
      await rp(options)
    } catch (err) {
      console.error('[error.communication]', err.message, '\n uri :', uri, '\n body:', options.body)
    }
  }

  async verifyAuthorization (id) {
    const url = this.resource + id + '/'
    const options = {
      method: 'PUT',
      uri: url,
      headers: {
        Authorization: this.config.apikeys.build
      }
    }

    await rp(options)
  }

  async startBuild (id) {
    const url = this.resource + id + this.startEndpoint

    await this._req(url)
  }

  async updateStdout (id, stdout) {
    const url = this.resource + id + this.stdoutEndpoint
    const buffered = this._getBuffers(id).stdout.write(stdout)

    if (buffered) {
      await this._req(url, { data: buffered })
    }
  }

  async updateStderr (id, stderr) {
    const url = this.resource + id + this.stderrEndpoint
    const buffered = this._getBuffers(id).stderr.write(stderr)

    if (buffered) {
      await this._req(url, { data: buffered })
    }
  }

  async endBuild (id, exitStatus) {
    const url = this.resource + id + this.endEndpoint

    await this.resetBuffer(id)
    await this._req(url, { exit_status: exitStatus })
  }

  async resetBuffer (id) {
    const urlStdout = this.resource + id + this.stdoutEndpoint
    const urlStderr = this.resource + id + this.stderrEndpoint
    const stdout = this._getBuffers(id).stdout.reset()
    const stderr = this._getBuffers(id).stderr.reset()

    if (stdout) {
      await this._req(urlStdout, { data: stdout })
    }
    if (stderr) {
      await this._req(urlStderr, { data: stderr })
    }

    delete this._getBuffers(id).stdout
    delete this._getBuffers(id).stderr
    delete this._getBuffers(id)
  }

  async updatePackage (id, data) {
    const url = this.resource + id + this.packageEndpoint

    await this._req(url, data)
  }
}

module.exports = Communication
