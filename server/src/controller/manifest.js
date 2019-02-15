class ManifestController {
  constructor (app) {
    this.app = app
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

    const manifestContent = await this.insertContent(manifest.id, content, date)

    return {
      ...manifest,
      history: [manifestContent]
    }
  }

  async insertContent (manifestId, content, editionDate) {
    return this.app.database.model.manifestContent.forge({
      manifest_id: manifestId,
      content,
      edition_date: editionDate
    })
      .save()
      .get('attributes')
  }

  async updateContent (manifestId, content) {
    const date = new Date()

    const manifestContent = await this.insertContent(manifestId, content, date)

    const manifest = await this.app.database.model.manifest
      .where('id', manifestId)
      .fetch()

    await manifest
      .save({ last_update: date })

    return manifestContent
  }

  async get (manifestId) {
    const manifest = await this.app.database.model.manifest
      .where('id', manifestId)
      .fetch({ withRelated: ['history'] })

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
