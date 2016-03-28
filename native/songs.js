const dl = require('./dl')
const exists = require('./utils/mediaexists')
const yturl = require('youtube-url')

module.exports = function (electron, mainWindow) {
  const ipcMain = electron.ipcMain

  ipcMain.on('acquireSong', function (event, url) {
    if (!yturl.valid(url)) return console.log('invalid url')
    var ytid = yturl.extractId(url)
    if (exists('yt-' + ytid + '.m4a')) return console.log('already exists', ytid)

    console.log('fetching url:', url)

    dl(url, function (err, info) {
      if (err) console.error(err)
      event.sender.send('acquiredSong', info)
    })
  })
}
