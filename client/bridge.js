var reduxStore

window.SlackRadio = global.SlackRadio = {
  add: require('../client/addSong'),
  ipc: require('../client/ipc'),

  next: function () {
    reduxStore.trigger('nextSong')
  },

  prev: function () {
    reduxStore.trigger('prevSong')
  },

  play: function () {
    reduxStore.trigger('playOrPause')
  },

  shuffle: function () {
    reduxStore.trigger('shuffle')
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
  }
}
