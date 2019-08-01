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
   * @param  {Integer}  id Id of a manifest
   * @return {Boolean}     true if the manifest exists, false otherwise
   */
  async exists (id) {
    const count = await this.app.database.model.manifest
      .where('id', id)
      .count()

    return count === '1'
  }

  /**
   * Retrieve a manifest by id
   *
   * @private
   * @param  {Integer}          id Id of a manifest
   * @return {Bookshelf.Model}     Model manifest to perform database actions on
   * @throws {NotFound}            If the manifest doesn't exists
   */
  async _get (id) {
    const manifestModel = await this.app.database.model.manifest
      .where('id', id)
      .fetch({ withRelated: ['history'] })

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
  async create (name, content) {
    const date = new Date()

    const manifest = await this.app.database.model.manifest.forge({
      name,
      creation_date: date,
      last_update: date
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
   * @param  {Integer}  manifestId  If of the manifest
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
   * Update a manifest: create a new content and update the last_update Date
   *
   * @public
   * @param  {Integer}  id      Id of the manifest
   * @param  {String}   content Content of the manifest
   * @return {Object}           Content of the manfiest
   * @throws {NotFound}         If the manifest doesn't exist
   */
  async updateContent (id, content) {
    const date = new Date()

    const manifest = await this._get(id)

    const manifestContent = await this._insertContent(id, content, date)

    await manifest
      .save({ last_update: date })

    return manifestContent
  }

  /**
   * Retrieve a manifest
   *
   * @public
   * @param   {Integer}  id Id of the manifest
   * @return  {Object}      The manifest
   * @throws  {NotFound}    If the manifest doesn't exist
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
   * @param  {Object}                               pagination          pagination object
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
        withRelated: ['history']
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
