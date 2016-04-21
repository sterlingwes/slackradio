const bindings = require('../keybindings')
const electron = require('electron')

var globalShortcut = electron.globalShortcut
var bindingsOn
var listenersOn

function registerBindings (mainWindow) {
  if (bindingsOn) return
  Object.keys(bindings).forEach(keyCombo => {
    globalShortcut.register(keyCombo, () => {
      var action = bindings[keyCombo]
      mainWindow.send('globalShortcut', action)
    })
  })
  console.log('key bindings on')
  bindingsOn = true
}

function unregisterBindings () {
  globalShortcut.unregisterAll()
  console.log('key bindings OFF')
  bindingsOn = false
}

function setupListeners (mainWindow) {
  if (listenersOn) return
  mainWindow.on('focus', registerBindings.bind(null, mainWindow))
  mainWindow.on('blur', unregisterBindings)
  listenersOn = true
}

module.exports = {
  enable: function (mainWindow) {
    registerBindings(mainWindow)
    setupListeners(mainWindow)
  },
  disable: unregisterBindings
}
