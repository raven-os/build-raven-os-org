const ManifestController = require('./manifest')
const Queue = require('../../rabbitmq')

class BuildController {
  static async create (manifestId) {
    const manifest = await ManifestController.get(manifestId)

    const queue = await new Queue('build-raven-os-org')

    await queue.send(Buffer.from((manifest.history.pop()).content))
    return manifest
  }
}

module.exports = BuildController
