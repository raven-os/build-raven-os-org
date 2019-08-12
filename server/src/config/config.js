const convict = require('convict')

const config = convict({
  port: {
    doc: 'Port on which the server will listen',
    format: 'port',
    default: 8000,
    env: 'PORT'
  },
  database: {
    postgres: {
      host: {
        format: String,
        default: 'localhost',
        env: 'DATABASE_HOST'
      },
      port: {
        format: 'port',
        default: 5432,
        env: 'DATABASE_PORT'
      },
      database: {
        format: String,
        default: 'build-raven-os-org',
        env: 'POSTGRES_DB'
      },
      user: {
        format: String,
        default: 'postgres',
        env: 'POSTGRES_USER'
      },
      password: {
        format: String,
        default: 'postgres',
        env: 'POSTGRES_PASSWORD'
      }
    },
    retry: {
      count: {
        doc: 'Number of database connection retry if it fails',
        format: Number,
        default: 10,
        env: 'DATABASE_RETRY_COUNT'
      },
      interval: {
        doc: 'Interval of time in millisecond between each retry',
        format: Number,
        default: 3 * 1000,
        env: 'DATABASE_RETRY_INTERVAL'
      }
    }
  },
  cors: {
    origin: {
      doc: 'Allowed origins for cors policy',
      format: Array,
      default: ['http://localhost:8080'],
      env: 'CORS_ORIGIN'
    }
  },
  builder_apikey: {
    doc: 'Private key to authenticate and authorize a builder',
    format: String,
    default: 'DEFINE_BUILDER_APIKEY',
    env: 'BUILDER_APIKEY'
  },
  pagination: {
    default_item_per_page: {
      format: Number,
      default: 15,
      env: 'PAGINATION_DEFAULT_ITEM_PER_PAGE'
    }
  }
})

try {
  const local = require('./config.local')
  config.load(local)
} catch (e) {}

config.validate({ allowed: 'strict' })

module.exports = config.getProperties()
