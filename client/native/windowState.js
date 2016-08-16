module.exports = function (electron, mainWindow) {
  mainWindow.on('blur', function () {
    mainWindow.send('globalShortcut', 'unfocused')
  })

  mainWindow.on('focus', function () {
    mainWindow.send('globalShortcut', 'focused')
  })
}
