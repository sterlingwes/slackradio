var ytInfo = require('./info')
var ytStream = require('./stream')

module.exports = function (url, done) {
  ytInfo(url, function (err, json) {
    if (err) done(err)
    done(null, ytStream(json))
  })
}
