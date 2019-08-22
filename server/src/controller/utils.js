const bcrypt = require('bcrypt')
const InternalServerError = require('../errors/internal-server-error')

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

module.exports = { hashPassword }
