const Queue = require('./queue')
const { exec, spawn } = require('child_process')
const rp = require('request-promise')
const fs = require('fs')
const Communication = require('./communication')
const Upload = require('./upload')
const path = require('path')

class Receiver {
  constructor (config) {
    this.config = config
    this.queueName = 'build-raven-os-org'
    this.queue = new Queue(this.queueName)
    this.communication = new Communication(this.config)
    this.upload = new Upload(this.config)
  }

  async run () {
    await this.pullDocker()
    await this.queue.receive(async (msg) => {
      const content = JSON.parse(msg.content.toString())
      const manifests = await this.getManifestList(content.manifests)

      try {
        await this.communication.verifyAuthorization(content.build)
      } catch (err) {
        console.error('[builder.authorization] authorization check failed. statusCode:', err.statusCode, 'message:', JSON.parse(err.error).message)
        return
      }

      await this.communication.startBuild(content.build)
      await this.buildManifests(content.build, manifests, 0)
    })
  }

  async pullDocker () {
    return new Promise((resolve, reject) => {
      exec('docker pull ravenos/nbuild', null, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        }

        console.log('[receiver.pullDocker.stdout]', stdout)
        console.log('[receiver.pullDocker.stderr]', stderr)
        resolve()
      })
    })
  }

  async getManifestList (ids) {
    const url = this.config.build_api_url + 'manifest/'
    const path = this.config.manifest_dir + 'manifest_'
    const options = {
      method: 'GET',
      headers: {
        Authorization: this.config.apikeys.build
      }
    }
    const manifests = []
    let result

    for (const id of ids) {
      options.url = url + id
      result = await rp(options)
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

      const outputDir = this.config.output_dir + (new Date()).getTime() + '/'
      const absolutePath = path.resolve(outputDir)

      const copy = 'cp config.toml.example config.toml'
      const nbuild = `./nbuild.py -vvv -o /app/out/ ${manifest.name}`
      const script = `docker run -v nbuild_manifests:/app/manifests/ -v nbuild_out:/app/out/ -it ravenos/nbuild /bin/bash -c "${copy} && ${nbuild}"`
      const child = spawn(script, [], { shell: true, stdio: ['inherit'] })

      child.stdout.on('data', async (data) => {
        console.log('[stdout]', data.toString())
        await this.communication.updateStdout(buildId, data)
      })
      child.stderr.on('data', async (data) => {
        console.log('[stderr]', data.toString())
        await this.communication.updateStderr(buildId, data)
      })

      child.on('exit', async (code) => {
        console.log('[exit]', code)
        const res = await this.upload.toNestServer(absolutePath)

        await this.communication.updatePackage(buildId, { data: res })
        await this.buildManifests(buildId, manifests, exitCode || code)
      })

      child.on('error', () => {
        console.log('[error]', arguments)
      })
    } catch (err) {
      console.error('[error.receiver.buildOneManifest]', err.message)
    }
  }
}

module.exports = Receiver
