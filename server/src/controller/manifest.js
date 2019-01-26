const Manifest = require('../database/model/manifest')
const ManifestContent = require('../database/model/manifest_content')

class ManifestController {
  static async create (name, content) {
    const date = new Date()

    const manifest = await Manifest.forge({
      name,
      creation_date: date,
      last_update: date
    })
      .save()
      .get('attributes')

    const manifestContent = await ManifestController.insertContent(manifest.id, content, date)

    return {
      ...manifest,
      history: [manifestContent]
    }
  }

  static async insertContent (manifestId, content, editionDate) {
    return ManifestContent.forge({
      manifest_id: manifestId,
      content,
      edition_date: editionDate
    })
      .save()
      .get('attributes')
  }

  static async updateContent (manifestId, content) {
    const date = new Date()

    const manifestContent = await ManifestController.insertContent(manifestId, content, date)

    const manifest = await Manifest
      .where('id', manifestId)
      .fetch()

    await manifest
      .save({ last_update: date })

    return manifestContent
  }

  static async get (manifestId) {
    const manifest = await Manifest
      .where('id', manifestId)
      .fetch({ withRelated: ['history'] })

    return manifest.toJSON()
  }
}

module.exports = ManifestController
