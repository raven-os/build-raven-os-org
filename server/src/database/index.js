const Model = require('./model')
const bookshelf = require('./bookshelf')

class Database {
  constructor (app) {
    this.app = app
    this.model = new Model(app)
    this.utils = {
      raw: bookshelf.knex.raw
    }
  }

  async ensureConnection () {
    let retries = this.app.config.database.retry.count || 5
    const interval = this.app.config.database.retry.interval || 1000

    while (retries) {
      try {
        await this.utils.raw('SELECT \'ensure connection\';')
        break
      } catch (err) {
        console.error(err)
        retries--
        console.info(`retries left: ${retries}, interval: ${interval} ms`)
        if (retries === 0) {
          throw err
        }
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }
  }
}

module.exports = Database
