const Queue = require('./queue')
const execFile = require('child_process').execFile
const config = require('./config')
const rp = require('request-promise')
const fs = require('fs')
const Communication = require('./communication')

class Receiver {
  constructor () {
    this.queueName = 'build-raven-os-org'
    this.queue = new Queue(this.queueName)
    this.communication = new Communication()
  }

  async run () {
    await this.queue.receive(async (msg) => {
      const content = JSON.parse(msg.content.toString())
      const manifests = await this.getManifestList(content.manifests)

      await this.communication.startBuild(content.build)
      await this.buildManifests(content.build, manifests, 0)
    })
  }

  async getManifestList (ids) {
    const url = config.url + 'manifest/'
    const path = config.manifest_dir + 'manifest_'
    const manifests = []
    let result

    for (let id of ids) {
      result = await rp(url + id)
      result = JSON.parse(result)
      result = {
        id,
        name: path + id + '.py',
        content: (result.history.pop()).content
      }
      manifests.push(result)
    }

    return manifests
  }

  async buildManifests (buildId, manifests, exitCode) {
    if (!manifests.length) {
      await this.communication.endBuild(buildId, exitCode)
    } else {
      await this.buildOneManifest(buildId, manifests, exitCode)
    }
  }

  async buildOneManifest (buildId, manifests, exitCode) {
    try {
      const manifest = manifests.shift()

      fs.writeFileSync(manifest.name, manifest.content)

      const child = execFile(config.nbuild, [manifest.name])

      child.stdout.on('data', async (data) => {
        await this.communication.updateStdout(buildId, data)
      })
      child.stderr.on('data', async (data) => {
        await this.communication.updateStderr(buildId, data)
      })
      child.on('exit', async (code) => {
        await this.buildManifests(buildId, manifests, exitCode || code)
      })
    } catch (err) {
      console.error('[error.receiver.buildOneManifest]', err.message)
    }
  }
}

module.exports = Receiver
