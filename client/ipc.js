/* globals SlackRadio */
var ipcRenderer = require('electron').ipcRenderer

ipcRenderer.on('globalShortcut', function (e, action) {
  if (action in window.SlackRadio) {
    window.SlackRadio[action]()
  } else {
    console.warn(action, 'not defined on global (window) scope')
  }
})

/*
 * when we've received an auth code from slack, pass it to our
 * API and "create" an account
 */
ipcRenderer.on('slackConnected', function (e, code) {
  console.log('received code', code)
  SlackRadio.api.slack.create({ code: code })
})

module.exports = ipcRenderer
