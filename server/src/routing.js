const express = require('express')

class Routing {
  constructor (app) {
    this.app = app
  }

  routing () {
    const notConnected = this.app.session.notConnected.bind(this.app.session)
    const connected = this.app.session.connected.bind(this.app.session)
    const connectedOrBuilder = this.app.session.connectedOrBuilder.bind(this.app.session)
    const admin = this.app.session.admin.bind(this.app.session)

    this.app.express.use('/api', express.Router()
      .post('/auth/login', notConnected, this.app.action.auth.login.routes)

      .delete('/auth/logout', connected, this.app.action.auth.logout.routes)

      .use('/invite', express.Router()
        .post('/', connected, admin, this.app.action.invitation.create.routes)
      )
      .use('/user', express.Router()
        .post('/', notConnected, this.app.action.user.create.routes)
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

  errorHandler (err, req, res, next) {
    let details = err.mapped && err.mapped()
    let errorParam = []
    if (details) {
      for (let param of Object.keys(details)) {
        errorParam.push({ param, detail: details[param].msg, value: details[param].value })
      }
    }

    if (!err.message) {
      err.message = errorParam.map(x => `${x.param}: ${x.detail}`).join('. ')
    }

    console.error('[error]', err.stack)
    res.status(err.status || 400)
    res.json({ message: err.message, errors: errorParam })
  }
}

module.exports = Routing
