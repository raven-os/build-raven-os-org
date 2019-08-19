const bookshelf = require('../bookshelf')

const Invitation = bookshelf.Model.extend({
  tableName: 'invitation'
})

module.exports = Invitation
