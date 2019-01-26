const bookshelf = require('../bookshelf')
const ManifestContent = require('./manifest_content')

const Manifest = bookshelf.Model.extend({
  tableName: 'manifest',
  history: function () {
    return this.hasMany(ManifestContent)
  }
})

module.exports = Manifest
