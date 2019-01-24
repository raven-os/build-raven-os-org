const Manifest = require('../database/model/manifest')

class ManifestController {
  static async create (name) {
    const date = new Date()

    return Manifest.forge({
      name,
      creation_date: date,
      last_update: date
    })
      .save()
      .get('attributes')
  }
}

module.exports = ManifestController
