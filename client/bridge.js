var reduxStore

window.SlackRadio = global.SlackRadio = {
  add: require('../client/addSong'),
  ipc: require('../client/ipc'),

  next: function () {
    reduxStore.trigger('nextSong')
  },

  prev: function () {
    var state = reduxStore.getState()
    var song = state.userSongs.playing
    if (song && song.elapsed > 3) {
      return reduxStore.trigger('restartSong')
    }
    reduxStore.trigger('prevSong')
  },

  play: function () {
    reduxStore.trigger('playOrPause')
  },

  restart: function () {
    reduxStore.trigger('restartSong')
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
  }
}
