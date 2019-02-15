const express = require('express')
const bodyParser = require('body-parser')

class Routing {
  constructor (app) {
    this.app = app
  }

  routing () {
    this.app.server.use(bodyParser.json())
    this.app.server.use(bodyParser.urlencoded({ extended: true }))

    this.app.server.use('/api', express.Router()
      .use('/manifest', express.Router()
        .post('/', this.app.action.manifest.create.routes)
        .put('/:id', this.app.action.manifest.update.routes)
        .get('/:id', this.app.action.manifest.get.routes)
        .get('/', this.app.action.manifest.list.routes)
      )
      .use('/build', express.Router()
        .post('/:id', this.app.action.build.create.routes)
      )
    )

    this.app.server.use(this.errorHandler.bind(this))
  }

  errorHandler (err, req, res, next) {
    let details = err.mapped && err.mapped()
    let errorParam = []
    if (details) {
      for (let param of Object.keys(details)) {
        errorParam.push({ param, detail: details[param].msg })
      }
    }
    console.error(err.stack)

    res.status(400)
    res.json({ message: err.message, errors: errorParam })
  }
}

module.exports = Routing
