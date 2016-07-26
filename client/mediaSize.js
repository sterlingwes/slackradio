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
      var size = 0
      var fileMap = stats.reduce(function (hash, file, i) {
        var id = files[i].split('.').shift()
        hash[id] = { size: file.size, filename: files[i] }
        size += file.size
        return hash
      }, {})

      var fileSize = filesize(size)
      var result = { total: fileSize, list: fileMap }
      store.trigger('sizedMedia', result)
      cb(null, result)
    })
  })
}
