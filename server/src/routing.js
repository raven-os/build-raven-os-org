const express = require('express')

/**
 * Define all the routes of the API
 *
 * @public
 * @class
 */
class Routing {
  constructor (app) {
    this.app = app
  }

  /**
   * Map actions and session middleware to each routes
   *
   * @public
   */
  routing () {
    const notConnected = this.app.session.notConnected.bind(this.app.session)
    const connected = this.app.session.connected.bind(this.app.session)
    const connectedOrBuilder = this.app.session.connectedOrBuilder.bind(this.app.session)
    const admin = this.app.session.admin.bind(this.app.session)

    this.app.express.use('/api', express.Router()
      .post('/auth/login', notConnected, this.app.action.auth.login.routes)
      .post('/auth/forgot', notConnected, this.app.action.auth.forgotPassword.routes)
      .put('/auth/reset', notConnected, this.app.action.auth.resetPassword.routes)

      .delete('/auth/logout', connected, this.app.action.auth.logout.routes)

      .use('/invite', express.Router()
        .post('/', connected, admin, this.app.action.invitation.create.routes)
      )
      .use('/user', express.Router()
        .post('/', notConnected, this.app.action.user.create.routes)
        .get('/:id', connected, this.app.action.user.get.routes)
        .get('/', connected, this.app.action.user.list.routes)
      )
      .use('/manifest', express.Router()
        .post('/', connected, this.app.action.manifest.create.routes)
        .put('/:id', connected, this.app.action.manifest.update.routes)
        .put('/:id/maintainer', connected, admin, this.app.action.manifest.updateMaintainer.routes)
        .get('/:id', connectedOrBuilder, this.app.action.manifest.get.routes)
        .get('/', connected, this.app.action.manifest.list.routes)
      )
      .use('/build', express.Router()
        .post('/', connected, this.app.action.build.create.routes)
        .use('/:id', express.Router({ mergeParams: true })
          .get('/', connected, this.app.action.build.get.routes)

          // Middleware to authorize only builder
          .use('/', this.app.action.build.authorization.routes)
          // Empty endpoint for a client to verify his access
          .put('/', (req, res, next) => { res.json({}) })
          .put('/start', this.app.action.build.start.routes)
          .put('/stdout', this.app.action.build.stdout.routes)
          .put('/stderr', this.app.action.build.stderr.routes)
          .put('/end', this.app.action.build.end.routes)
          .put('/packages', this.app.action.build.packages.routes)
        )
        .get('/', connected, this.app.action.build.list.routes)
      )
    )

    this.app.express.use(this.errorHandler.bind(this))
  }

  /**
   * Error handler, fallback when an error occure on a route
   * Format and send an error response to the client
   *
   * @param  {Error}    err  The error
   * @param  {Request}  req  The incoming request
   * @param  {Response} res  The outgoing response
   * @param  {Function} next The next route
   */
  errorHandler (err, req, res, next) {
    const details = err.mapped && err.mapped()
    const errorParam = []
    if (details) {
      for (const param of Object.keys(details)) {
        errorParam.push({ param, detail: details[param].msg, value: details[param].value })
      }
    }

    if (!err.message) {
      err.message = errorParam.map(x => `${x.param}: ${x.detail}`).join('. ')
    }

    this.app.logger.error('[error]', err.stack)
    res.status(err.status || 400)
    res.json({ message: err.message, errors: errorParam })
  }
}

module.exports = Routing
