var ipcRenderer = require('electron').ipcRenderer

module.exports = function (url) {
  console.log('adding source', url)
  ipcRenderer.send('acquireSong', url)
}
