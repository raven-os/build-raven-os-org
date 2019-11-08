const bcrypt = require('bcrypt')
const InternalServerError = require('../errors/internal-server-error')
const BadRequest = require('../errors/bad-request')
const crypto = require('crypto')
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

async function generateToken (size = 20) {
  const errorMessage = 'Unexpected error when generating token'
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, res) => {
      if (err) {
        reject(new InternalServerError(`${errorMessage}: ${err.message}`))
      } else {
        resolve(res.toString('hex'))
      }
    })
  })
}

module.exports = { hashPassword, comparePassword, generateToken }
