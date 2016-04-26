/* global localStorage */

const keys = ['playlist', 'playCounts']

module.exports = {
  read: function (key, defaultVal) {
    defaultVal = typeof defaultVal === 'undefined' ? [] : defaultVal
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
  },

  fromJSON: function (jsonStr) {
    var json
    try {
      json = JSON.parse(jsonStr)
    } catch (e) {
      console.error('Unable to parse file', e)
    }

    if (!json) return false

    keys.forEach(key => {
      localStorage.setItem(key, JSON.stringify(json[key]))
    })
  }
}
