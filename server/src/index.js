
const express = require('express')
const Routing = require('./routing')
const config = require('./config')

const server = express()

const routing = new Routing(server)

routing.routing(server)

server.listen(config.port, () => {
  console.info('[server] running on port', config.port)
})
