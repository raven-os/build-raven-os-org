class Logger {
  log () {
    console.log.apply(console, Array.prototype.slice.call(arguments))
  }

  info () {
    console.info.apply(console, Array.prototype.slice.call(arguments))
  }

  error () {
    console.error.apply(console, Array.prototype.slice.call(arguments))
  }
}

module.exports = Logger
