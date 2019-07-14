const ws = require('ws')
const _ = require('lodash')

// Contains methods related to a single connection
class WsConnection {
  static connection (connection) {
    this.connections.push(connection)
    connection.on('close', WsConnection.close.bind(this, connection))
    connection.on('error', WsConnection.error.bind(this, connection))
  }

  static close (connection) {
    _.remove(this.connections, (x) => x === connection)
  }

  static error (connection, err) {
    const from = connection._socket._peername
    console.log('[WsConnection.error] from', from.address + ':' + from.port, err)
  }
}

class WebsocketServer {
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

  broadcast (message) {
    for (let connection of this.connections) {
      connection.send(message)
    }
  }
}

module.exports = WebsocketServer
