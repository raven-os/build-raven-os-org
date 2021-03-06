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
const Logger = require('./logger')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

/**
 * The application class regroup every part of the API together
 *
 * @public
 * @class
 */
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
    this.logger = new Logger()
  }

  /**
   * Initialize every part of the application
   * Start the mailer, connect to the database
   * Run the migration (and populate the database in dev env)
   * Connect to the queue and instanciate the http server and the routing
   *
   * @public
   */
  async run () {
    await this.mailer.init()
    await this.database.ensureConnection()
    await this.database.runMigrations()

    if (this.config.populateDB) {
      await this.database.runSeeds()
    }

    await this.queue._getInstance()

    this.express = express()
    this.express.use(this.requestLogger.bind(this))
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
      this.logger.info('[server] running on port', this.config.port)
    })
  }

  /**
   * Middleware to log each endpoints requested
   *
   * @param  {Request}  req  The incoming request
   * @param  {Response} res  The outgoing response
   * @param  {Function} next The next route
   */
  requestLogger (req, res, next) {
    this.logger.log(req.method, req.originalUrl)
    next()
  }
}

module.exports = Application
