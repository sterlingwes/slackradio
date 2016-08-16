const bindings = require('../keybindings')

var globalShortcut
var mainWindow

function registerBindings () {
  Object.keys(bindings).forEach(keyCombo => {
    globalShortcut.register(keyCombo, () => {
      var action = bindings[keyCombo]
      mainWindow.send('globalShortcut', action)
    })
  })
}

module.exports = function (electron, win) {
  globalShortcut = electron.globalShortcut
  mainWindow = win

  mainWindow.on('focus', registerBindings)
  mainWindow.on('blur', () => {
    globalShortcut.unregisterAll()
  })
}
