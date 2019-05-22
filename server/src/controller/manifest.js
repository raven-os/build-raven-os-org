class ManifestController {
  constructor (app) {
    this.app = app
  }

  async exists (id) {
    const count = await this.app.database.model.manifest
      .where('id', id)
      .count()

    return count === '1'
  }

  async _get (id) {
    const manifestModel = await this.app.database.model.manifest
      .where('id', id)
      .fetch({ withRelated: ['history'] })

    if (!manifestModel) {
      throw new this.app.errors.NotFound(`Manifest #${id} not found`)
    }

    return manifestModel
  }

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

  async _insertContent (manifestId, content, editionDate) {
    return this.app.database.model.manifestContent.forge({
      manifest_id: manifestId,
      content,
      edition_date: editionDate
    })
      .save()
      .get('attributes')
  }

  async updateContent (id, content) {
    const date = new Date()

    const manifest = await this._get(id)

    const manifestContent = await this._insertContent(id, content, date)

    await manifest
      .save({ last_update: date })

    return manifestContent
  }

  async get (id) {
    const manifest = await this._get(id)

    return manifest.toJSON()
  }

  // TODO: filters
  async list () {
    const manifests = await this.app.database.model.manifest
      .fetchAll({ withRelated: ['history'] })

    return manifests.toJSON()
  }
}

module.exports = ManifestController
