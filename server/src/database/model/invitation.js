const bookshelf = require('../bookshelf')

const Invitation = bookshelf.Model.extend({
  requireFetch: false,
  tableName: 'invitation'
})

module.exports = Invitation
