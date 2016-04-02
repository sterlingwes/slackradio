module.exports = {

  queueSong: {
    type: 'choose song',
    index: 0
  },

  nextSong: { type: 'next song' },

  prevSong: { type: 'last song' },

  elapsed: function (pct) {
    return { type: 'song progress', percent: pct }
  },

  play: { type: 'play' },

  pause: { type: 'pause' },

  playOrPause: { type: 'toggle play' },

  songPicked: function (i) {
    return { type: 'pick song', index: i }
  },

  shuffle: { type: 'shuffle' },

  playSort: function (order) {
    return { type: 'sort by play count', order: order }
  },

  deleteActive: { type: 'delete active' },

  addingSong: { type: 'adding song' }

}
