const bookshelf = require('./database/bookshelf')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const RIGHTS = require('./controller/user').rights

/**
 * Session contains middleware the ensure that only authenticated
 * and authorized users can access the API endpoints
 *
 * @public
 * @class
 */
class Session {
  constructor (app) {
    this.app = app
  }

  /**
   * Instantiate the session middleware
   *
   * @return {Object} Session middleware object
   */
  middleware () {
    this.store = new KnexSessionStore({
      knex: bookshelf.knex,
      tablename: 'session'
    })

    this.session = session({
      store: this.store,
      secret: this.app.config.session.secret,
      resave: false,
      saveUninitialized: false,
      name: 'user_sid',
      cookie: {
        httpOnly: false
      }
    })

    return this.session
  }

  /**
   * Remove session cookie if it's an invalid cookie
   *
   * @param  {Request}  req  The incoming request
   * @param  {Response} res  The outgoing response
   * @param  {Function} next The next route
   */
  clearCookie (req, res, next) {
    if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid')
    }

    next()
  }

  /**
   * Ensure that no user is connected
   *
   * @param  {Request}  req  The incoming request
   * @param  {Response} res  The outgoing response
   * @param  {Function} next The next route
   * @throws {Unauthorized}  If a user is connected
   */
  notConnected (req, res, next) {
    if (req.session.user) {
      throw new this.app.errors.Unauthorized('You are already connected')
    }

    next()
  }

  /**
   * Ensure that a user is connected
   *
   * @param  {Request}  req  The incoming request
   * @param  {Response} res  The outgoing response
   * @param  {Function} next The next route
   * @throws {Unauthorized}  If a user is not connected
   */
  connected (req, res, next) {
    if (!req.cookies.user_sid || !req.session.user) {
      throw new this.app.errors.Unauthorized('You must be connected')
    }

    next()
  }

  /**
   * Ensure that a user is connected or the builder sends the request
   *
   * @param  {Request}  req  The incoming request
   * @param  {Response} res  The outgoing response
   * @param  {Function} next The next route
   * @throws {Unauthorized}  If it's neither a connected user or a builder
   */
  connectedOrBuilder (req, res, next) {
    if (!req.cookies.user_sid || !req.session.user) {
      if (!req.headers.authorization) {
        throw new this.app.errors.Unauthorized('You must be connected')
      }
      try {
        this.app.controller.build.authorization(req.headers.authorization)
      } catch (err) {
        throw new this.app.errors.Unauthorized('You must be connected')
      }
    }

    next()
  }

  /**
   * Ensure that the connected user has admin rights
   *
   * @param  {Request}  req  The incoming request
   * @param  {Response} res  The outgoing response
   * @param  {Function} next The next route
   * @throws {Forbidden}     If a user is not admin
   */
  admin (req, res, next) {
    if (!req.session.user.rights || !req.session.user.rights.includes(RIGHTS.ADMIN)) {
      throw new this.app.errors.Forbidden('You don\'t have admin rights')
    }

    next()
  }
}

module.exports = Session
