/* global localStorage */

const playlistKey = 'playlist'

module.exports = {
  read: function (key) {
    return JSON.parse(localStorage.getItem(key || playlistKey) || '[]')
  },

  write: function (playlist, key) {
    var jsonStr = JSON.stringify(playlist)
    localStorage.setItem(key || playlistKey, jsonStr)
  }
}
