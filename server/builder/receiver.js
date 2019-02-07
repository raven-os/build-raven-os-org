const Queue = require('../rabbitmq')
const execFile = require('child_process').execFile
// const fs = require('fs')
// const config = require('../src/config')

receiver().then(console.log('receiver started'))

async function receiver () {
  const queue = await new Queue('build-raven-os-org')

  await queue.receive((msg) => {
    console.log('message received')
    // const data = msg.content.toString()

    // TODO: for now use temporary test.sh script to mock compilation
    // program is started from raven/test/nbuild for now
    // const name = '../../build-raven-os-org/server/manifests/manifest_' + new Date().getTime() + '.py'

    try {
      // fs.writeFileSync(name, data)

      const child = execFile('./builder/test.sh', [], {
        detached: true,
        stdio: [ 'ignore', 1, 2 ]
      })
      /* function (error, stdout, stderr) {
        if (error) {
          console.error('error', error)
        }
        console.log('stdout', stdout)
        console.log('stderr', stderr)
      })
      */

      child.unref()
      child.stdout.on('data', (data) => {
        console.log('[output]', data)
      })
    } catch (err) {
      console.error(err)
    }
  })

  // queue.close()
}
