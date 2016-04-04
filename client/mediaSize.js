var fs = require('fs')
var files = require('./mediaFiles')
var filesize = require('filesize')
var asnc = require('async')

function getSize (filename, cb) {
  fs.stat('media/' + filename, cb)
}

const noop = function () {}

module.exports = function (store, cb) {
  if (!cb) cb = noop
  files(function (err, files) {
    if (err) return cb(err)
    asnc.map(files, getSize, function (err, stats) {
      if (err) return cb(err)
      var size = stats.reduce(function (total, stat) {
        total += stat.size
        return total
      }, 0)

      var fileSize = filesize(size)
      store.trigger('sizeMedia', fileSize)
      cb(null, fileSize)
    })
  })
}
