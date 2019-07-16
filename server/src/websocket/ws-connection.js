const _ = require('lodash')

// Contains methods related to a single connection
// Binded to WebsocketServer to access 'this'
class WsConnection {
  static connection (connection, req) {
    const from = {
      ip: req.connection.remoteAddress,
      port: req.connection.remotePort
    }

    this.connections.push(connection)
    connection.on('close', WsConnection.close.bind(this, connection))
    connection.on('error', WsConnection.error.bind(this, connection, from))
  }

  static close (connection) {
    _.remove(this.connections, (x) => x === connection)
  }

  static error (connection, from, err) {
    console.log('[WsConnection.error] from', from.ip + ':' + from.port, err)
    connection.terminate()
  }
}

module.exports = WsConnection
