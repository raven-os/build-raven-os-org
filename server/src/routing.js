const express = require('express')
const bodyParser = require('body-parser')
// TODO: regroup theses actions
const CreateManifest = require('./action/manifest/create')
const UpdateManifest = require('./action/manifest/update')
const GetManifest = require('./action/manifest/get')
const ListManifest = require('./action/manifest/list')
const CreateBuild = require('./action/build/create')

class Routing {
  constructor (server) {
    this.server = server
  }

  routing () {
    const create = new CreateManifest()
    const update = new UpdateManifest()
    const get = new GetManifest()
    const list = new ListManifest()
    const createBuild = new CreateBuild()

    this.server.use(bodyParser.json())
    this.server.use(bodyParser.urlencoded({ extended: true }))

    // TODO: regroup by endpoint
    this.server.use('/api', express.Router()
      .post('/manifest', create.routes)
      .put('/manifest/:id', update.routes)
      .get('/manifest/:id', get.routes)
      .get('/manifest', list.routes)
      .post('/build/:id', createBuild.routes)
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
