const _ = require('lodash')

const config = require('./config')
let local = {}

try {
  local = require('./config.local')
} catch (e) {}

module.exports = _.merge({}, config, local)
