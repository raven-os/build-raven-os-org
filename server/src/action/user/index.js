const CreateUser = require('./create')
const GetUser = require('./get')
const ListUser = require('./list')

class UserAction {
  constructor (app) {
    this.create = new CreateUser(app)
    this.get = new GetUser(app)
    this.list = new ListUser(app)
  }
}

module.exports = UserAction
