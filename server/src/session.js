const bookshelf = require('./database/bookshelf')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const RIGHTS = require('./controller/user').rights

class Session {
  constructor (app) {
    this.app = app
  }

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
      name: 'user_sid'
    })

    return this.session
  }

  clearCookie (req, res, next) {
    if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid')
    }

    next()
  }

  notConnected (req, res, next) {
    if (req.session.user) {
      throw new this.app.errors.Unauthorized('You are already connected')
    }

    next()
  }

  connected (req, res, next) {
    if (!req.cookies.user_sid || !req.session.user) {
      throw new this.app.errors.Unauthorized('You must be connected')
    }

    next()
  }

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

  admin (req, res, next) {
    if (!req.session.user.rights || !req.session.user.rights.includes(RIGHTS.ADMIN)) {
      throw new this.app.errors.Forbidden('You don\'t have admin rights')
    }

    next()
  }
}

module.exports = Session
