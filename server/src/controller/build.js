class BuildController {
  constructor (app) {
    this.app = app
  }

  async create (ids) {
    // TODO: verify that manifests exists

    const date = new Date()

    const build = await this.app.database.model.build.forge({
      manifest_id: ids,
      queuing: true,
      running: false,
      exit_status: null,
      stdout: '',
      stderr: null,
      creation_date: date,
      start_date: null,
      end_date: null
    })
      .save()
      .get('attributes')

    await this.app.queue.send(Buffer.from(ids))
    return build
  }

  async stdout (buildId, stdout) {
    let build = await this.app.database.model.build
      .where('id', buildId)
      .fetch()

    await build
      .save({
        stdout: this.app.database.utils.raw('concat(stdout, ?::text)', stdout)
      })

    build = await build.refresh()

    return build.toJSON()
  }

  async stderr (buildId, stderr) {
    let build = await this.app.database.model.build
      .where('id', buildId)
      .fetch()

    await build
      .save({
        stderr: this.app.database.utils.raw('concat(stderr, ?::text)', stderr)
      })

    build = await build.refresh()

    return build.toJSON()
  }

  async start (buildId) {
    const date = new Date()

    const build = await this.app.database.model.build
      .where('id', buildId)
      .fetch()

    await build
      .save({
        queuing: false,
        running: true,
        start_date: date
      })

    return build
  }

  async end (buildId, exitStatus) {
    const date = new Date()

    const build = await this.app.database.model.build
      .where('id', buildId)
      .fetch()

    await build
      .save({
        running: false,
        exit_status: exitStatus,
        end_date: date
      })

    return build
  }

  async get (buildId) {
    const build = await this.app.database.model.build
      .where('id', buildId)
      .fetch()

    return build.toJSON()
  }

  // TODO: filters
  async list () {
    const builds = await this.app.database.model.build
      .fetchAll()

    return builds.toJSON()
  }
}

module.exports = BuildController
