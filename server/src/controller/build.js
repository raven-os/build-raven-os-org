class BuildController {
  constructor (app) {
    this.app = app
  }

  authorization (apikey) {
    if (apikey !== this.app.config.builder_apikey) {
      throw new this.app.errors.Forbidden('Invalid builder apikey')
    }
  }

  async _get (id) {
    const buildModel = await this.app.database.model.build
      .where('id', id)
      .fetch()

    if (!buildModel) {
      throw new this.app.errors.NotFound(`Build #${id} not found`)
    }

    return buildModel
  }

  async create (ids) {
    for (let id of ids) {
      if (!await this.app.controller.manifest.exists(id)) {
        throw new this.app.errors.NotFound(`Manifest #${id} not found`)
      }
    }

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

    const msg = {
      build: build.id,
      manifests: ids
    }

    await this.app.queue.send(Buffer.from(JSON.stringify(msg)))
    return build.toJSON()
  }

  async stdout (id, stdout) {
    let build = await this._get(id)

    await build
      .save({
        stdout: this.app.database.utils.raw('concat(stdout, ?::text)', stdout)
      })

    build = await build.refresh()

    return build.toJSON()
  }

  async stderr (id, stderr) {
    let build = await this._get(id)

    await build
      .save({
        stderr: this.app.database.utils.raw('concat(stderr, ?::text)', stderr)
      })

    build = await build.refresh()

    return build.toJSON()
  }

  async start (id) {
    let build = await this._get(id)
    const date = new Date()

    await build
      .save({
        queuing: false,
        running: true,
        start_date: date
      })

    build = await build.refresh()

    return build.toJSON()
  }

  async end (id, exitStatus) {
    let build = await this._get(id)
    const date = new Date()

    await build
      .save({
        running: false,
        exit_status: exitStatus,
        end_date: date
      })

    build = await build.refresh()

    return build.toJSON()
  }

  async get (id) {
    const build = await this._get(id)

    return build.toJSON()
  }

  async list (sort, direction, filters) {
    const builds = await this.app.database.model.build
      .query(queryBuilder => {
        if (filters.queuing !== null) {
          queryBuilder.where('queuing', filters.queuing)
        }
        if (filters.running !== null) {
          queryBuilder.where('running', filters.running)
        }
        if (filters.manifestId !== null) {
          queryBuilder.where('manifest_id', '@>', [filters.manifestId])
        }
        if (filters.exitStatus !== null) {
          queryBuilder.where('exit_status', filters.exitStatus)
        }
      })
      .orderBy(sort, direction)
      .fetchAll()

    return builds.toJSON()
  }
}

module.exports = BuildController
