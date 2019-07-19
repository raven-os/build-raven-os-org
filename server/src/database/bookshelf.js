const config = require('../config')
const knex = require('knex')({
  client: 'pg',
  connection: {
    ...config.database.postgres,
    charset: 'utf8'
  }
})

const bookshelf = require('bookshelf')(knex)

bookshelf.plugin('pagination')

module.exports = bookshelf
