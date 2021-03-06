'use strict'

const path = require('path')
const rootTemplate = path.resolve(__dirname, '../build/index.html')
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  // mainWindow = new BrowserWindow({ width: 1200, height: 570, frame: true })
  // mainWindow.webContents.openDevTools()
  mainWindow = new BrowserWindow({ width: 800, height: 570, frame: false })

  // register song handler
  require('./songs')(electron, mainWindow)

  // register shortcut handler
  require('./keys')(electron, mainWindow)

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + rootTemplate)

  // handle focus & blur
  require('./windowState')(electron, mainWindow)

  // handle slack auth
  require('./slack')(electron)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// ensure our app has priority while in the background
app.commandLine.appendSwitch('disable-renderer-backgrounding')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
