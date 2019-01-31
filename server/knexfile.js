const config = require('./src/config')
const postgresConfig = config.database.postgres

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      ...postgresConfig
    }
  }
}
