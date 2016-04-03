const dl = require('./dl')
const exists = require('./utils/mediaexists')
const yturl = require('youtube-url')

module.exports = function (electron, mainWindow) {
  const ipcMain = electron.ipcMain

  ipcMain.on('acquireSong', function (event, url) {
    if (!yturl.valid(url)) return console.log('invalid url')
    var ytid = yturl.extractId(url)
    if (exists('yt-' + ytid + '.m4a')) return console.log('already exists', ytid)

    console.log('acquiring url:', url)

    dl(url, function (err, info) {
      if (err) console.error(err)
      event.sender.send('acquiredSong', info)
    })
  })

  var fetching = []

  ipcMain.on('fetchSong', function (event, url) {
    if (fetching.indexOf(url) !== -1) {
      return console.warn('already fetching url:', url)
    }
    console.log('fetching url:', url)
    fetching.push(url)

    dl(url, function (err, info) {
      if (err) console.error(err)
      var idx = fetching.indexOf(url)
      if (idx !== -1) fetching.splice(idx, 1)
      event.sender.send('fetchedSong', info)
    })
  })
}
