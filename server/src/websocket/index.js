const ws = require('ws')
const WsConnection = require('./ws-connection')

const actions = {
  BUILD_START: 'BUILD_START',
  BUILD_STDOUT: 'BUILD_STDOUT',
  BUILD_STDERR: 'BUILD_STDERR',
  BUILD_END: 'BUILD_END',
  BUILD_PACKAGES: 'BUILD_PACKAGES'
}

class WebsocketServer {
  get actions () {
    return actions
  }

  constructor (app) {
    this.app = app
    this.connections = []
  }

  run (server) {
    this.ws = new ws.Server({
      server,
      path: '/ws'
    })

    this.ws.on('connection', WsConnection.connection.bind(this))
    this.ws.on('error', this.error)
  }

  error (err) {
    console.log('[WebsocketServer.error]', err)
  }

  broadcast (type, data) {
    for (let connection of this.connections) {
      connection.send(JSON.stringify({ type, data }))
    }
  }
}

module.exports = WebsocketServer
