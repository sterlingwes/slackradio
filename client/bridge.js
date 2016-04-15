var _ = require('lodash')
var electron = require('electron')
var Control = require('../client/playerControl')

var control

var sr = window.SlackRadio = global.SlackRadio = {
  api: require('../client/api')(),
  add: require('../client/addSong'),
  ipc: require('../client/ipc'),

  next: function () {
    var state = sr._store.getState()
    var nextSong = state.userSongs.getNext()
    if (!nextSong || !nextSong.exists) {
      nextSong.fetchSong()
      return sr._store.trigger('fetchSong', nextSong.id)
    }
    sr._store.trigger('nextSong')
  },

  prev: function () {
    var state = sr._store.getState()
    var song = state.userSongs.playing
    if (song && song.elapsed > 3) {
      return sr._store.trigger('restartSong')
    }
    var lastSong = state.userSongs.getLast()
    if (!lastSong.exists) {
      lastSong.fetchSong()
      return sr._store.trigger('fetchSong', lastSong.id)
    }
    sr._store.trigger('prevSong')
  },

  shuffle: function () {
    sr._store.trigger('shuffle')
  },

  sortByPlays: function () {
    var state = sr._store.getState()
    var playCounts = state.stats.songCounts
    var songIds = Object.keys(playCounts)
    songIds.sort(function (a, b) {
      return (playCounts[a] || 0) - (playCounts[b] || 0)
    })
    sr._store.trigger('playSort', songIds)
  },

  delete: function () {
    sr._store.trigger('deleteActive')
    sr.getMediaSize()
  },

  focusAdd: function () {
    var input = document.getElementById('songUrl')
    if (input) input.focus()
  },

  registerStore: function (store) {
    control = new Control(store)
    _.extend(sr, control)
    sr._store = store
  },

  focused: function () {
    sr._store.trigger('windowFocus')
  },

  unfocused: function () {
    sr._store.trigger('windowLostFocus')
  },

  showRadio: function () {
    sr._store.trigger('routeChange', 'radio')
  },

  showLibrary: function () {
    sr._store.trigger('routeChange', 'playlist')
  },

  showSettings: function () {
    sr._store.trigger('routeChange', 'settings')
  },

  getMediaSize: function (cb) {
    return require('../client/mediaSize')(sr._store, cb)
  },

  deleteMedia: function (cb) {
    return require('../client/mediaDelete')(sr._store, cb)
  },

  fs: require('fs'),
  dialog: electron.remote.dialog
}
