var reduxStore

window.SlackRadio = global.SlackRadio = {
  add: require('../client/addSong'),
  ipc: require('../client/ipc'),

  next: function () {
    var state = reduxStore.getState()
    var nextSong = state.userSongs.getNext()
    if (!nextSong || !nextSong.exists) {
      nextSong.fetchSong()
      return reduxStore.trigger('fetchSong', nextSong.id)
    }
    reduxStore.trigger('nextSong')
  },

  prev: function () {
    var state = reduxStore.getState()
    var song = state.userSongs.playing
    if (song && song.elapsed > 3) {
      return reduxStore.trigger('restartSong')
    }
    var lastSong = state.userSongs.getLast()
    if (!lastSong.exists) {
      lastSong.fetchSong()
      return reduxStore.trigger('fetchSong', lastSong.id)
    }
    reduxStore.trigger('prevSong')
  },

  play: function () {
    reduxStore.trigger('playOrPause')
  },

  shuffle: function () {
    reduxStore.trigger('shuffle')
  },

  sortByPlays: function () {
    var state = reduxStore.getState()
    var playCounts = state.stats.songCounts
    var songIds = Object.keys(playCounts)
    songIds.sort(function (a, b) {
      return (playCounts[a] || 0) - (playCounts[b] || 0)
    })
    reduxStore.trigger('playSort', songIds)
  },

  delete: function () {
    reduxStore.trigger('deleteActive')
  },

  focusAdd: function () {
    var input = document.getElementById('songUrl')
    if (input) input.focus()
  },

  registerStore: function (store) {
    reduxStore = store
  },

  focused: function () {
    reduxStore.trigger('windowFocus')
  },

  unfocused: function () {
    reduxStore.trigger('windowLostFocus')
  },

  showRadio: function () {
    reduxStore.trigger('routeChange', 'radio')
  },

  showLibrary: function () {
    reduxStore.trigger('routeChange', 'playlist')
  },

  showSettings: function () {
    reduxStore.trigger('routeChange', 'settings')
  },

  fs: require('fs')
}
