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
  nbuild: 'nbuild',
  url: 'URL_OF_THE_API',
  manifest_dir: '/path/to/manifest/directory'
}
