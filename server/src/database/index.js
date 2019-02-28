const Model = require('./model')
const bookshelf = require('./bookshelf')

class Database {
  constructor (app) {
    this.model = new Model(app)
    this.utils = {
      raw: bookshelf.knex.raw
    }
  }
}

module.exports = Database
