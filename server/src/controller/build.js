/**
 * Performs actions related to builds
 *
 * @public
 * @class
 */
class BuildController {
  constructor (app) {
    this.app = app
    this.state = {
      QUEUING: 'queuing',
      RUNNING: 'running',
      FINISHED: 'finished'
    }
  }

  /**
   * Verify if the builder apikey is correct
   *
   * @public
   * @param  {String}  apikey Builder apikey
   * @throws {Forbidden}      If the apikey is wrong
   */
  authorization (apikey) {
    if (apikey !== this.app.config.builder_apikey) {
      throw new this.app.errors.Forbidden('Invalid builder apikey')
    }
  }

  /**
   * Retrieve a build by ID
   *
   * @private
   * @param  {Integer}          id ID of a build
   * @return {Bookshelf.Model}     Model build to perform database actions on
   * @throws {NotFound}            If the build doesn't exists
   */
  async _get (id) {
    const buildModel = await this.app.database.model.build
      .where('id', id)
      .fetch()

    if (!buildModel) {
      throw new this.app.errors.NotFound(`Build #${id} not found`)
    }

    return buildModel
  }

  /**
   * Create a build and send it in the queue
   *
   * @public
   * @param  {Integer[]}  ids  List of manifest IDs
   * @param  {User}       user User creating the build
   * @return {Object}          The build
   * @throws {BadRequest}      If the list of manifest IDs is empty
   * @throws {NotFound}        If one of the manifest IDs doesn't exists
   * @throws {Forbidden}       If the user is not an admin or the maintainer of all the manifests
   */
  async create (ids, user) {
    if (!ids.length) {
      throw new this.app.errors.BadRequest('A build needs at least one manifest')
    }

    for (const id of ids) {
      if (!await this.app.controller.manifest.exists(id)) {
        throw new this.app.errors.NotFound(`Manifest #${id} not found`)
      }

      if (!user.rights.includes('admin') && !await this.app.controller.manifest.isMaintainer(id, user.id)) {
        throw new this.app.errors.Forbidden(`Manifest #${user.id} can only be built by its maintainer`)
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

  /**
   * Concatenate the new output log coming from the builder
   * Then send to build to a websocket
   *
   * @public
   * @param  {Integer}  id      ID of the build
   * @param  {String}   stdout  New output log to append
   * @return {Object}           The updated build
   * @throws {NotFound}         If the build doesn't exists
   */
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

  /**
   * Concatenate the new error log coming from the builder
   * Then send to build to a websocket
   *
   * @public
   * @param  {Integer}  id      ID of the build
   * @param  {String}   stdout  New output log to append
   * @return {Object}           The updated build
   * @throws {NotFound}         If the build doesn't exists
   */
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

  /**
   * Concatenate the packages url coming from the builder
   * Then send to build to a websocket
   *
   * @public
   * @param  {Integer}  id       ID of the build
   * @param  {String[]} packages List of packages built
   * @return {Object}            The updated build
   * @throws {NotFound}          If the build doesn't exists
   */
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

  /**
   * Update the state and the start date of a build
   * Then send to build to a websocket
   *
   * @public
   * @param  {Integer}  id      ID of the build
   * @return {Object}           The updated build
   * @throws {NotFound}         If the build doesn't exists
   */
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

  /**
   * Update the state, the end date and the exit status of a build
   * Then send to build to a websocket
   *
   * @public
   * @param  {Integer}  id         ID of the build
   * @param  {Integer}  exitStatus ID of the build
   * @return {Object}              The updated build
   * @throws {NotFound}            If the build doesn't exists
   */
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

  /**
   * Retrieve a build
   *
   * @public
   * @param   {Integer}  id ID of the build
   * @return  {Object}      The build
   * @throws  {NotFound}    If the build doesn't exists
   */
  async get (id) {
    const build = await this._get(id)

    return build.toJSON()
  }

  /**
   * List all builds matching the filters
   *
   * @public
   * @param  {'creation_date'|'start_date'|'end_date'} sort               Column to sort on
   * @param  {'asc'|'desc'}                            direction          Direction of the sort
   * @param  {Object}                                  filters            Filter object
   * @param  {Integer}                                 filters.manifestId Manifest ID contained in the list of manifest IDs built
   * @param  {Integer}                                 filters.exitStatus Exit status
   * @param  {Object}                                  pagination         Pagination object
   * @param  {Integer}                                 pagination.perPage Number of item per page
   * @param  {Integer}                                 pagination.page    Page to retrieve
   * @return {Object}                                                     List of builds found and metadata containing pagination information
   */
  async list (sort, direction, filters, pagination) {
    const builds = await this.app.database.model.build
      .query(queryBuilder => {
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
