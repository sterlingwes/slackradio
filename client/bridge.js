var _ = require('lodash')
var electron = require('electron')
var Control = require('../client/playerControl')

var extensions = {
  api: require('../client/api')(),
  add: require('../client/addSong'),
  ipc: require('../client/ipc'),
  fs: require('fs'),
  dialog: electron.remote.dialog
}

var control = new Control()
window.SlackRadio = global.SlackRadio = control
_.extend(control, extensions)
