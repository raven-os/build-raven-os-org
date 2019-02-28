const Queue = require('./rabbitmq')
const execFile = require('child_process').execFile
const config = require('./config')
const rp = require('request-promise')
const fs = require('fs')

receiver().then(console.log('receiver started'))

// TODO: Bufferize the output to send 4096 char at a time to not send too much requests

async function receiver () {
  const queue = new Queue('build-raven-os-org')

  await queue.receive(async (msg) => {
    const data = [...msg.content]
    const url = config.url + 'manifest/'
    const manifests = []
    const path = config.manifest_dir + 'manifest_'
    let result

    for (let id of data) {
      result = await rp(url + id)
      result = JSON.parse(result)
      result = {
        name: path + id + '.py',
        content: (result.history.pop()).content
      }
      manifests.push(result)
      // TODO: remove this break when nbuild will handle multiple manifests
      break
    }

    const names = manifests.map((item) => { return item.name })

    try {
      for (let file of manifests) {
        fs.writeFileSync(file.name, file.content)
      }

      const child = execFile(config.nbuild, names, {
        detached: true,
        stdio: [ 'ignore', 1, 2 ]
      })

      child.unref()
      // TODO: send it to the API to store the output
      child.stdout.on('data', (data) => {
        console.log('[output]', data)
      })
      child.stderr.on('data', (data) => {
        console.log('[stderr]', data)
      })
    } catch (err) {
      console.error(err)
    }
  })
}
