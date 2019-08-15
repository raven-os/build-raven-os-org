const convict = require('convict')

const config = convict({
  nbuild_path: {
    doc: 'Path to the nbuild executable',
    format: String,
    default: null,
    env: 'NBUILD_PATH'
  },
  build_api_url: {
    doc: 'URL of build-raven-os-org API',
    format: String,
    default: 'localhost:8000',
    env: 'BUILD_API_URL'
  },
  manifest_dir: {
    doc: 'Path to the directory where manifests are stored',
    format: String,
    default: './manifests/',
    env: 'MANIFEST_DIR'
  },
  output_dir: {
    doc: 'Path to the directory where the build\'s results are stored',
    format: String,
    default: './out/',
    env: 'OUTPUT_DIR'
  },
  buffer_size: {
    doc: 'Size of the bufferized build logs to send to build-raven-os-org',
    format: Number,
    default: 2048,
    env: 'BUFFER_SIZE'
  },
  nest_server_api_url: {
    doc: 'URL of nest-server to send built packages',
    format: String,
    default: 'localhost:8000',
    env: 'NEST_SERVER_API_URL'
  },
  apikeys: {
    build: {
      doc: 'Authentication apikey for communication with build-raven-os-org',
      format: String,
      default: 'DEFINE_BUILDER_APIKEY',
      env: 'APIKEYS_BUILD'
    },
    nest_server: {
      doc: 'Authentication apikey for communication with nest-server',
      format: String,
      default: 'DEFINE_NEST_SERVER_APIKEY',
      env: 'APIKEYS_NEST_SERVER'
    }
  },
  queue: {
    rabbitmq: {
      url: {
        doc: 'Url of rabbitMQ server',
        format: String,
        default: 'amqp://localhost:5672',
        env: 'RABBIT_MQ_URL'
      },
      retry: {
        count: {
          doc: 'Number of rabbitMQ connection retry if it fails',
          format: Number,
          default: 10,
          env: 'RABBIT_MQ_RETRY_COUNT'
        },
        interval: {
          doc: 'Interval of time in millisecond between each retry',
          format: Number,
          default: 3 * 1000,
          env: 'RABBIT_MQ_RETRY_INTERVAL'
        }
      }
    }
  }
})

try {
  const local = require('./config.local')
  config.load(local)
} catch (e) {}

config.validate({ allowed: 'strict' })

module.exports = config.getProperties()
