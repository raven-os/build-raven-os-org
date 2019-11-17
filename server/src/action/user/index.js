const CreateUser = require('./create')
const GetUser = require('./get')

class UserAction {
  constructor (app) {
    this.create = new CreateUser(app)
    this.get = new GetUser(app)
  }
}

module.exports = UserAction
