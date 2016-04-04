var fs = require('fs')

module.exports = function (cb) {
  fs.readdir('media', cb)
}
