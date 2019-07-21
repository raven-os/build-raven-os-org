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
  cors: {
    origin: ['http://localhost:8080']
  },
  builder_apikey: 'DEFINE_BUILDER_APIKEY',
  pagination: {
    default_item_per_page: 15
  }
}
