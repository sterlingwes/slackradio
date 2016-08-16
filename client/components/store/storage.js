/* global localStorage */

const keys = ['playlist', 'playCounts']

module.exports = {
  read: function (key, defaultVal) {
    defaultVal = defaultVal || []
    return JSON.parse(localStorage.getItem(key)) || defaultVal
  },

  write: function (key, val) {
    var jsonStr = JSON.stringify(val)
    localStorage.setItem(key, jsonStr)
  },

  toJSON: function () {
    var json = keys.reduce((hash, key) => {
      hash[key] = JSON.parse(localStorage.getItem(key))
      return hash
    }, {})
    return JSON.stringify(json)
  }
}
