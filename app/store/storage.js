/* global localStorage */

module.exports = {
  read: function (key, defaultVal) {
    defaultVal = defaultVal || []
    return JSON.parse(localStorage.getItem(key)) || defaultVal
  },

  write: function (key, val) {
    var jsonStr = JSON.stringify(val)
    localStorage.setItem(key, jsonStr)
  }
}
