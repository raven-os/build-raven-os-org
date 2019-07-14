const _ = require('lodash')

// Contains methods related to a single connection
// Binded to WebsocketServer to access this
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

module.exports = WsConnection
