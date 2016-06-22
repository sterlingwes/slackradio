const slack = require('../slack.json')
const clientId = slack.clientId
const scope = 'channels:read users:read'

module.exports = function (electron) {
  var ipc = electron.ipcMain

  /*
   * pop open an SSO dialog for Slack creds and grab the
   * auth code to pass on to our API
   */
  ipc.on('connectSlack', function (ipcEvent) {
    var BrowserWindow = electron.BrowserWindow
    var authWindow = new BrowserWindow({
      width: 500,
      height: 500,
      show: false,
      'node-integration': false,
      'web-security': false
    })

    var url = `https://slack.com/oauth/authorize?client_id=${clientId}&scope=${scope}`
    authWindow.loadURL(url)

    authWindow.webContents.on('did-stop-loading', function () {
      authWindow.show()
    })

    authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
      if (/localhost\/srcallback/.test(newUrl)) {
        authWindow.close()
        var matchCode = newUrl.match(/code=(.*)(&||$)/)
        if (!matchCode) {
          ipcEvent.sender.send('slackFailed')
          return console.warn('no auth code received')
        }

        var code = matchCode[1].split('&')
        ipcEvent.sender.send('slackConnected', code[0]) // /client/ipc
      }
    })

    authWindow.on('closed', function () {
      authWindow = null
    })
  })
}
