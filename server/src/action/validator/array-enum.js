module.exports = (enumeration) => {
  return (value) => {
    return value.every(str => enumeration.includes(str))
  }
}
