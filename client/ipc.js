var ipcRenderer = require('electron').ipcRenderer

ipcRenderer.on('globalShortcut', function (e, action) {
  if (action in window.SlackRadio) {
    window.SlackRadio[action]()
  } else {
    console.warn(action, 'not defined on global (window) scope')
  }
})

ipcRenderer.on('slackConnected', function (e, code) {
  var api = require('../app/api/feathers')
  console.log('received code', code)
  api.slack.create({ code: code })
})

module.exports = ipcRenderer
