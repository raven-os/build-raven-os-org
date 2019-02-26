class BuildController {
  constructor (app) {
    this.app = app
  }

  async create (ids) {
    // TODO: verify that manifests exists

    await this.app.queue.send(Buffer.from(ids))
    return {}
  }
}

module.exports = BuildController
