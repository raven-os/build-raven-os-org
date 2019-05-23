module.exports = {
  port: 8000,
  database: {
    postgres: {
      host: 'localhost',
      port: 5432,
      database: 'build-raven-os-org',
      user: 'postgres',
      password: 'postgres'
    }
  },
  builder_apikey: 'DEFINE_BUILDER_APIKEY'
}
