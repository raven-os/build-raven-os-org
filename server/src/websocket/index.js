const ws = require('ws')
const WsConnection = require('./ws-connection')

const actions = {
  BUILD_START: 'BUILD_START',
  BUILD_STDOUT: 'BUILD_STDOUT',
  BUILD_STDERR: 'BUILD_STDERR',
  BUILD_END: 'BUILD_END',
  BUILD_PACKAGES: 'BUILD_PACKAGES'
}

/**
 * The WebSocket server allows connected clients to receive updates
 * about builds in real time
 *
 * @public
 * @class
 */
class WebsocketServer {
  get actions () {
    return actions
  }

  constructor (app) {
    this.app = app
    this.connections = []
  }

  /**
   * Start the websocket server
   *
   * @param  {Object} server The HTTP server
   */
  run (server) {
    this.ws = new ws.Server({
      server,
      path: '/ws'
    })

    this.ws.on('connection', WsConnection.connection.bind(this))
    this.ws.on('error', this.error)
  }

  /**
   * Error callback
   *
   * @param  {Error} err An error
   */
  error (err) {
    console.log('[WebsocketServer.error]', err)
  }

  /**
   * Broadcast an event to all clients
   *
   * @public
   * @param  {String} type Type of event
   * @param  {Object} data Data updated in real time
   */
  broadcast (type, data) {
    for (const connection of this.connections) {
      connection.send(JSON.stringify({ type, data }))
    }
  }
}

module.exports = WebsocketServer
