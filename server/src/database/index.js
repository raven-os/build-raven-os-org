const Model = require('./model')
const bookshelf = require('./bookshelf')
const knexMigrate = require('knex-migrate')

class Database {
  constructor (app) {
    this.app = app
    this.model = new Model(app)
    this.utils = {
      raw: bookshelf.knex.raw.bind(bookshelf.knex)
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

  async runMigrations () {
    const logger = ({ migration }) => console.info('Running migration', migration)

    return knexMigrate('up', {}, logger)
  }
}

module.exports = Database
