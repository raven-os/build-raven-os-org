module.exports = (value) => {
  return value && value.toLowerCase().replace(/(?:^|\s|-)\S/g, (str) => str.toUpperCase())
}
