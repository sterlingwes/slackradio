const electron = require('electron')
const ipc = electron.ipcMain
const keyBinder = require('./keys')

module.exports = function (mainWindow) {
  ipc.on('deregisterShortcuts', function () {
    keyBinder.disable()
  })

  ipc.on('registerShortcuts', function () {
    keyBinder.enable(mainWindow)
  })

  mainWindow.on('blur', function () {
    mainWindow.send('globalShortcut', 'unfocused')
  })

  mainWindow.on('focus', function () {
    mainWindow.send('globalShortcut', 'focused')
  })

  mainWindow.webContents.on('devtools-focused', function () {
    mainWindow.send('globalShortcut', 'unfocused')
  })

  mainWindow.webContents.on('devtools-closed', function () {
    mainWindow.send('globalShortcut', 'focused')
  })
}
