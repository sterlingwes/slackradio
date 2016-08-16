var exec = require('child_process').execFile

module.exports = function (url, done) {
  exec('./bin/youtube-dl', ['--extract-audio', '--dump-json', url], function (err, stdout, stderr) {
    if (err) return done(err)
    var json
    try {
      json = JSON.parse(stdout.toString())
    } catch (e) {
      console.error('json parse failure', e)
      return done(e)
    }
    if (json) {
      delete json.formats
      console.log(JSON.stringify(json, null, ' '))
      done(null, json)
    }
  })
}

// module.exports('https://www.youtube.com/watch?v=KVtcp8XHhOo')
