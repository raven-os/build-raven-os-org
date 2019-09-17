const AbstractAction = require('../abstract')

class Logout extends AbstractAction {
  async handler (req) {
    req.session.destroy((err) => {
      if (err) {
        console.error('[logout.err]', err)
      }
    })

    return {}
  }
}

module.exports = Logout
