var makeStyle = require('./makeStyle')

module.exports = function (styles, newStyles) {
  styles = styles.split(';')
  var map = styles.reduce(function (hash, style) {
    var pair = style.split(':')
    if (pair.length !== 2 || !pair[1]) return hash
    hash[pair[0]] = pair[1]
    return hash
  }, {})

  Object.keys(newStyles).forEach(function (key) {
    map[key] = newStyles[key]
  })

  return makeStyle(map)
}
