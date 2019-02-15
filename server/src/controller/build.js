class BuildController {
  constructor (app) {
    this.app = app
  }

  async create (manifestId) {
    const manifest = await this.app.controller.manifest.get(manifestId)

    await this.app.queue.send(Buffer.from((manifest.history.pop()).content))
    return manifest
  }
}

module.exports = BuildController
