const Model = require('./model')
const bookshelf = require('./bookshelf')
const knexMigrate = require('knex-migrate')

/**
 * Database interacts with the Postgres database
 *
 * @public
 * @class
 */
class Database {
  constructor (app) {
    this.app = app
    this.model = new Model(app)
    this.utils = {
      raw: bookshelf.knex.raw.bind(bookshelf.knex)
    }
  }

  /**
   * Try to connect to the database multiple times if it fails
   *
   * @public
   */
  async ensureConnection () {
    let retries = this.app.config.database.retry.count || 5
    const interval = this.app.config.database.retry.interval || 1000

    while (retries) {
      try {
        await this.utils.raw('SELECT \'ensure connection\';')
        break
      } catch (err) {
        console.error('[database.ensureConnection]', err)
        retries--
        console.info(`retries left: ${retries}, interval: ${interval} ms`)
        if (retries === 0) {
          throw err
        }
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }
  }

  /**
   * Run the migrations to create the tables
   *
   * @public
   */
  async runMigrations () {
    const logger = ({ migration }) => console.info('Running migration', migration)

    return knexMigrate('up', {}, logger)
  }

  /**
   * Run the seeds to populate the database with some data
   *
   * @public
   */
  async runSeeds () {
    console.log('Populating database')

    const res = await bookshelf.knex.seed.run()
    console.log('Ran', res[0])
  }
}

module.exports = Database
