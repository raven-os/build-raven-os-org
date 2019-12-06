/**
 * Performs actions related to manifests
 *
 * @public
 * @class
 */
class ManifestController {
  constructor (app) {
    this.app = app
  }

  /**
   * Verify if a manifest exists
   *
   * @public
   * @param  {Integer}  id ID of a manifest
   * @return {Boolean}     true if the manifest exists, false otherwise
   */
  async exists (id) {
    const count = await this.app.database.model.manifest
      .where('id', id)
      .count()

    return count === '1'
  }

  /**
   * Verify if a manifest with a maintainer exists
   *
   * @param  {Integer}  id     ID of a manifest
   * @param  {Integer}  userId ID of a user
   * @return {Boolean}         true if the user is the maintainer of the manifest
   */
  async isMaintainer (id, userId) {
    const count = await this.app.database.model.manifest
      .where('id', id)
      .where('maintainer', userId)
      .count()

    return count === '1'
  }

  /**
   * Retrieve a manifest by id and retrieve its author and maintainer names
   *
   * @private
   * @param  {Integer}          id ID of a manifest
   * @return {Bookshelf.Model}     Model manifest to perform database actions on
   * @throws {NotFound}            If the manifest doesn't exists
   */
  async _get (id) {
    const userJSON = (field) => {
      return `CASE
        WHEN ${field}.id IS NULL THEN NULL
        ELSE json_build_object('id', ${field}.id, 'firstname', ${field}.firstname, 'lastname', ${field}.lastname)
      END AS ${field}`
    }

    const manifestModel = await this.app.database.model.manifest
      .where('manifest.id', id)
      .query(qb => {
        qb.leftJoin('user_account AS author', 'manifest.author', 'author.id')
        qb.leftJoin('user_account AS maintainer', 'manifest.maintainer', 'maintainer.id')
      })
      .fetch({
        columns: [
          'manifest.id',
          'manifest.name',
          'manifest.creation_date',
          'manifest.last_update',
          this.app.database.utils.raw(userJSON('author')),
          this.app.database.utils.raw(userJSON('maintainer'))
        ],
        withRelated: [
          { history: (query) => { query.orderBy('edition_date') } }
        ]
      })

    if (!manifestModel) {
      throw new this.app.errors.NotFound(`Manifest #${id} not found`)
    }

    return manifestModel
  }

  /**
   * Create a manifests and a manifestContent
   *
   * @public
   * @param  {String}  name    Name of the manifest
   * @param  {String}  content Content of the manifest
   * @return {Object}          Manifest with its content
   */
  async create (name, content, authorId) {
    const date = new Date()

    const manifest = await this.app.database.model.manifest.forge({
      name,
      creation_date: date,
      last_update: date,
      author: authorId,
      maintainer: authorId
    })
      .save()
      .get('attributes')

    const manifestContent = await this._insertContent(manifest.id, content, date)

    return {
      ...manifest,
      history: [manifestContent]
    }
  }

  /**
   * Create a manifest_content
   *
   * @private
   * @param  {Integer}  manifestId  ID of the manifest
   * @param  {String}   content     Content of the manifest
   * @param  {Date}     editionDate Date of creation of manifest_content
   * @return {Object}               The manifest content object
   */
  async _insertContent (manifestId, content, editionDate) {
    return this.app.database.model.manifestContent.forge({
      manifest_id: manifestId,
      content,
      edition_date: editionDate
    })
      .save()
      .get('attributes')
  }

  /**
   * Update a manifest: create a new content and update the last_update date
   *
   * @public
   * @param  {Integer}  id      ID of the manifest
   * @param  {String}   content New content of the manifest
   * @return {Object}           New Content and metadata of the manifest's new content
   * @throws {NotFound}         If the manifest doesn't exists
   */
  async updateContent (id, content, user) {
    const date = new Date()

    const manifest = await this._get(id)
    const manifestJson = manifest.toJSON()

    if (!user.rights.includes('admin') && (!manifestJson.maintainer || manifestJson.maintainer.id !== user.id)) {
      throw new this.app.errors.Forbidden(`Manifest #${user.id} can only be updated by its maintainer`)
    }

    const manifestContent = await this._insertContent(id, content, date)

    await manifest
      .save({ last_update: date }, { patch: true })

    return manifestContent
  }

  /**
   * Update a manifest's maintainer
   *
   * @param  {Integer}  id            ID of the manifest
   * @param  {Integer}  newMaintainer Usr id of the new maintainer
   * @return {Object}                 The manifest
   * @throws {NotFound}               If the manifest or user doesn't exists
   */
  async updateMaintainer (id, newMaintainer) {
    if (!await this.app.controller.user.exists(newMaintainer, 'id')) {
      throw new this.app.errors.NotFound(`User #${newMaintainer} not found`)
    }

    const manifest = await this._get(id)

    await manifest
      .save({ maintainer: newMaintainer }, { patch: true })

    return this.get(id)
  }

  /**
   * Retrieve a manifest
   *
   * @public
   * @param   {Integer}  id ID of the manifest
   * @return  {Object}      The manifest
   * @throws  {NotFound}    If the manifest doesn't exists
   */
  async get (id) {
    const manifest = await this._get(id)

    return manifest.toJSON()
  }

  /**
   * List all manifest matching the filters
   *
   * @public
   * @param  {String}                               name                Match all manifest starting with this name
   * @param  {'name'|'creation_date'|'last_update'} sort                Column to sort on
   * @param  {'asc'|'desc'}                         direction           Direction of the sort
   * @param  {Object}                               pagination          Pagination object
   * @param  {Integer}                              pagination.perPage  Number of item per page
   * @param  {Integer}                              pagination.page     Page to retrieve
   * @return {Object}                                                   List of manifests found and metadata containing pagination information
   */
  async list (name, sort, direction, pagination) {
    const manifests = await this.app.database.model.manifest
      .where('name', 'LIKE', name + '%')
      .orderBy(sort, direction)
      .fetchPage({
        pageSize: pagination.perPage,
        page: pagination.page,
        withRelated: [
          { history: (query) => { query.orderBy('edition_date') } }
        ]
      })

    return {
      data: manifests.toJSON(),
      meta: {
        pagination: {
          total: manifests.pagination.rowCount,
          perPage: manifests.pagination.pageSize,
          currentPage: manifests.pagination.page,
          pageCount: manifests.pagination.pageCount
        }
      }
    }
  }
}

module.exports = ManifestController
