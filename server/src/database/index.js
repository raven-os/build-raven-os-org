const Model = require('./model')

class Database {
  constructor (app) {
    this.model = new Model(app)
  }
}

module.exports = Database
