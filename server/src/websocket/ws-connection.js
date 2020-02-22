const _ = require('lodash')

/**
 * Contains methods related to a single websocket connection
 * Binded to the websocket server to acces its context
 *
 * @public
 * @class
 */
class WsConnection {
  /**
   * Save the current connection and set some callbacks
   *
   * @param  {Object}  connection The incoming connection
   * @param  {Request} req        The incoming request
   */
  static connection (connection, req) {
    const from = {
      ip: req.connection.remoteAddress,
      port: req.connection.remotePort
    }

    this.connections.push(connection)
    connection.on('close', WsConnection.close.bind(this, connection))
    connection.on('error', WsConnection.error.bind(this, connection, from))
  }

  /**
   * Callback to remove a connection when it is closing
   *
   * @param  {Object} connection The connection closing
   */
  static close (connection) {
    _.remove(this.connections, (x) => x === connection)
  }

  /**
   * Callback handling and logging errors on a connection
   *
   * @param  {Object} connection The connection having an error
   * @param  {Object} from       The source
   * @param  {Error}  err        The error
   */
  static error (connection, from, err) {
    console.log('[WsConnection.error] from', from.ip + ':' + from.port, err)
    connection.terminate()
  }
}

module.exports = WsConnection
