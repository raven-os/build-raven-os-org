class BuildController {
  constructor (app) {
    this.app = app
    this.state = {
      QUEUING: 'queuing',
      RUNNING: 'running',
      FINISHED: 'finished'
    }
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

  async create (ids, userId) {
    if (!ids.length) {
      throw new this.app.errors.BadRequest('A build needs at least one manifest')
    }

    for (let id of ids) {
      if (!await this.app.controller.manifest.exists(id)) {
        throw new this.app.errors.NotFound(`Manifest #${id} not found`)
      }

      if (!await this.app.controller.manifest.isMaintainer(id, userId)) {
        throw new this.app.errors.Forbidden(`Manifest #${id} can only be built by its maintainer`)
      }
    }

    const date = new Date()

    const build = await this.app.database.model.build.forge({
      manifest_id: ids,
      exit_status: null,
      stdout: '',
      stderr: '',
      creation_date: date,
      start_date: null,
      end_date: null,
      state: this.state.QUEUING,
      packages: []
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
    build = build.toJSON()

    this.app.websocket.broadcast(this.app.websocket.actions.BUILD_STDOUT, build)

    return build
  }

  async stderr (id, stderr) {
    let build = await this._get(id)

    await build
      .save({
        stderr: this.app.database.utils.raw('concat(stderr, ?::text)', stderr)
      })

    build = await build.refresh()
    build = build.toJSON()

    this.app.websocket.broadcast(this.app.websocket.actions.BUILD_STDERR, build)

    return build
  }

  async packages (id, packages) {
    let build = await this._get(id)

    await build
      .save({
        packages: this.app.database.utils.raw('array_cat(packages, ?::text[])', [packages])
      })

    build = await build.refresh()
    build = build.toJSON()

    this.app.websocket.broadcast(this.app.websocket.actions.BUILD_PACKAGES, build)

    return build
  }

  async start (id) {
    let build = await this._get(id)
    const date = new Date()

    await build
      .save({
        state: this.state.RUNNING,
        start_date: date
      })

    build = await build.refresh()
    build = build.toJSON()

    this.app.websocket.broadcast(this.app.websocket.actions.BUILD_START, build)

    return build
  }

  async end (id, exitStatus) {
    let build = await this._get(id)
    const date = new Date()

    await build
      .save({
        state: this.state.FINISHED,
        exit_status: exitStatus,
        end_date: date
      })

    build = await build.refresh()
    build = build.toJSON()

    this.app.websocket.broadcast(this.app.websocket.actions.BUILD_END, build)

    return build
  }

  async get (id) {
    const build = await this._get(id)

    return build.toJSON()
  }

  async list (sort, direction, filters, pagination) {
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
      .fetchPage({
        pageSize: pagination.perPage,
        page: pagination.page
      })

    return {
      data: builds.toJSON(),
      meta: {
        pagination: {
          total: builds.pagination.rowCount,
          perPage: builds.pagination.pageSize,
          currentPage: builds.pagination.page,
          pageCount: builds.pagination.pageCount
        }
      }
    }
  }
}

module.exports = BuildController
