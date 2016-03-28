var ipcRenderer = require('electron').ipcRenderer

ipcRenderer.on('globalShortcut', function (e, action) {
  if (action in window.SlackRadio) {
    window.SlackRadio[action]()
  } else {
    console.warn(action, 'not defined on global (window) scope')
  }
})

module.exports = ipcRenderer
