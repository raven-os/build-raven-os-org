const AbstractAction = require('../abstract')

class Logout extends AbstractAction {
  async handler (req, res) {
    res.clearCookie('user_sid')
    req.session.destroy((err) => {
      if (err) {
        console.error('[logout.err]', err)
      } else {
      }
    })

    return {}
  }
}

module.exports = Logout
