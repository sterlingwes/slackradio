var fs = require('fs')

module.exports = function (filename) {
  var fileinfo
  try {
    fileinfo = fs.statSync('./media/' + filename)
  } catch (e) {}
  return fileinfo
}
