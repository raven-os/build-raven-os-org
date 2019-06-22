const simplepaginate = require('bookshelf-simplepaginate')
const config = require('../config')
const knex = require('knex')({
  client: 'pg',
  connection: {
    ...config.database.postgres,
    charset: 'utf8'
  }
})

const bookshelf = require('bookshelf')(knex)

bookshelf.plugin(simplepaginate)

module.exports = bookshelf
