const http = require('http')
const config = require('./config')
const Database = require('./database')
const Controller = require('./controller')
const Action = require('./action')
const Queue = require('./queue')
const express = require('express')
const Routing = require('./routing')
const Errors = require('./errors')
const Websocket = require('./websocket')
const Mailer = require('./mailer')
const Session = require('./session')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

class Application {
  constructor () {
    this.config = config
    this.action = new Action(this)
    this.database = new Database(this)
    this.controller = new Controller(this)
    this.queue = new Queue('build-raven-os-org')
    this.errors = new Errors(this)
    this.websocket = new Websocket(this)
    this.mailer = new Mailer(this)
    this.session = new Session(this)
  }

  async run () {
    await this.mailer.init()
    await this.database.ensureConnection()
    await this.database.runMigrations()

    if (this.config.populateDB) {
      await this.database.runSeeds()
    }

    await this.queue._getInstance()

    this.express = express()
    this.express.use(this.logger)
    this.express.use(helmet())
    this.express.use(cors(this.config.cors))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: true }))
    this.express.use(cookieParser())
    this.express.use(this.session.middleware())
    this.express.use(this.session.clearCookie)

    const routing = new Routing(this)
    routing.routing()

    this.server = http.createServer(this.express)

    this.server.listen(this.config.port, () => {
      this.websocket.run(this.server)
      console.info('[server] running on port', this.config.port)
    })
  }

  logger (req, res, next) {
    console.log(req.method, req.originalUrl)
    next()
  }
}

module.exports = Application
