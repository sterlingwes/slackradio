var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var request = require('request')

var dir, filePath, isWin
var defaultBin = path.join(__dirname, '..', 'bin')
var defaultPath = path.join(defaultBin, 'details')
var regexp = /https:\/\/yt-dl\.org\/downloads\/(\d{4}\.\d\d\.\d\d(\.\d)?)\/youtube-dl/
var url = 'https://rg3.github.io/youtube-dl/download.html'

function download (link, callback) {
  'use strict'
  var downloadFile = request.get(link)
  var status = null

  downloadFile.on('response', function response (res) {
    if (res.statusCode !== 200) {
      status = new Error('Response Error: ' + res.statusCode)
      return
    }
    downloadFile.pipe(fs.createWriteStream(filePath, {mode: 457}))
  })

  downloadFile.on('error', function error (err) { callback(err); })

  downloadFile.on('end', function end () { callback(status); })
}

function createBase (binDir) {
  'use strict'
  isWin = (process.platform === 'win32' || process.env.NODE_PLATFORM === 'windows') ? true : false
  dir = (binDir) ? binDir : defaultBin
  mkdirp.sync(dir)
  if (binDir) { mkdirp.sync(defaultBin); }
  filePath = path.join(dir, 'youtube-dl' + ((isWin) ? '.exe' : ''))
}

function downloader (binDir, callback) {
  'use strict'
  if (typeof binDir === 'function') {
    callback = binDir
    binDir = null
  }

  createBase(binDir)

  request.get(url, function get (err, res, body) {
    if (err || res.statusCode !== 200) { return callback(err || new Error('Response Error: ' + res.statusCode)); }

    var m = regexp.exec(body)

    if (!m) { return callback(new Error('Could not find download link in ' + url)); }

    // Check if there is a new version available.
    var newVersion = m[1]

    var details = fs.existsSync(defaultPath) && fs.readFileSync(defaultPath, 'utf8')

    if (details) { details = JSON.parse(details); }

    if (newVersion === details.version && fs.existsSync(details.path)) { return callback(null, 'Already up to date ' + newVersion); }

    var link = m[0]
    if (isWin) { link += '.exe'; }

    download(link, function error (err) {
      if (err) { return callback(err); }
      fs.writeFileSync(defaultPath, JSON.stringify({version: newVersion, path: filePath}), 'utf8')
      callback(null, 'Downloaded youtube-dl ' + newVersion)
    })
  })
}

module.exports = downloader

downloader(function error (err, done) {
  'use strict'
  if (err) { return console.log(err.stack) }
  console.log(done)
})
