const config = require('./config')
const Database = require('./database')
const Controller = require('./controller')
const Action = require('./action')
const Queue = require('./queue')
const express = require('express')
const Routing = require('./routing')
const Errors = require('./errors')

class Application {
  constructor () {
    this.config = config
    this.action = new Action(this)
    this.database = new Database(this)
    this.controller = new Controller(this)
    this.queue = new Queue('build-raven-os-org')
    this.errors = new Errors(this)
  }

  run () {
    this.server = express()
    this.server.use(this.logger)

    const routing = new Routing(this)
    routing.routing()

    this.server.listen(this.config.port, () => {
      console.info('[server] running on port', this.config.port)
    })
  }

  logger (req, res, next) {
    console.log(req.method, req.originalUrl)
    next()
  }
}

module.exports = Application
