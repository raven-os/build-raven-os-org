const express = require('express')
const bodyParser = require('body-parser')

class Routing {
  constructor (app) {
    this.app = app
  }

  routing () {
    this.app.express.use(bodyParser.json())
    this.app.express.use(bodyParser.urlencoded({ extended: true }))

    this.app.express.use('/api', express.Router()
      .use('/invite', express.Router()
        .post('/', this.app.action.invitation.create.routes)
      )
      .use('/manifest', express.Router()
        .post('/', this.app.action.manifest.create.routes)
        .put('/:id', this.app.action.manifest.update.routes)
        .get('/:id', this.app.action.manifest.get.routes)
        .get('/', this.app.action.manifest.list.routes)
      )
      .use('/build', express.Router()
        .post('/', this.app.action.build.create.routes)
        .use('/:id', express.Router({ mergeParams: true })
          .get('/', this.app.action.build.get.routes)

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
        .get('/', this.app.action.build.list.routes)
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
    console.error('[error]', err.stack)
    res.status(err.status || 400)
    res.json({ message: err.message, errors: errorParam })
  }
}

module.exports = Routing
