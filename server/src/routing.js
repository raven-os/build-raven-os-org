const express = require('express')
const bodyParser = require('body-parser')
const CreateManifest = require('./action/manifest/create')

class Routing {
  constructor (server) {
    this.server = server
  }

  routing () {
    const create = new CreateManifest()

    this.server.use(bodyParser.json())
    this.server.use('/api', express.Router()
      .post('/manifest', create.routes)
    )

    this.server.use(this.errorHandler.bind(this))
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
