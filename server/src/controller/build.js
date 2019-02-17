class BuildController {
  constructor (app) {
    this.app = app
  }

  async create (ids) {
    // TODO: retrieve every manifests from  the builder
    // const manifest = await this.app.controller.manifest.get(manifestId)
    // manifest.history.pop().content

    await this.app.queue.send(Buffer.from(ids))
    return {}
  }
}

module.exports = BuildController
