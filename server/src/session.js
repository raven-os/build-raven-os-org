const bookshelf = require('./database/bookshelf')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

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
}

module.exports = Session
