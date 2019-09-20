const bcrypt = require('bcrypt')
const InternalServerError = require('../errors/internal-server-error')
const BadRequest = require('../errors/bad-request')

const saltRounds = 10

async function hashPassword (password) {
  const errorMessage = 'Unexpected error when hashing password'
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(new InternalServerError(`${errorMessage}: ${err.message}`))
      } else {
        resolve(hash)
      }
    })
  })
}

async function comparePassword (plainPassword, hashedPassword) {
  const errorMessage = 'Unexpected error when login'
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
      if (err) {
        reject(new InternalServerError(`${errorMessage}: ${err.message}`))
      } else if (!res) {
        reject(new BadRequest('Wrong password'))
      } else {
        resolve()
      }
    })
  })
}

module.exports = { hashPassword, comparePassword }
