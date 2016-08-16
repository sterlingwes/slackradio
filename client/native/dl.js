var yt = require('./yt')
var fs = require('fs')
var fn = require('./utils/filename')

module.exports = function (url, done) {
  yt(url, function (err, stream) {
    if (err) done(err)

    var meta

    stream.on('info', function (info) {
      console.log('info!', info)
      meta = info
      stream.pipe(fs.createWriteStream(fn(info)))
    })

    stream.on('error', function (err) {
      done(err)
    })

    stream.on('end', function () {
      done(null, meta)
    })
  })
}
