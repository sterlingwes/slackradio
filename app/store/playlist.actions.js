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

  songPicked: function (i, isPlaying) {
    return { type: 'pick song', index: i, play: isPlaying }
  },

  fetchSong: function (songId) {
    return { type: 'fetch song', id: songId }
  },

  fetchedSong: function (songId) {
    return { type: 'fetched song', id: songId }
  },

  shuffle: { type: 'shuffle' },

  playSort: function (order) {
    return { type: 'sort by play count', order: order }
  },

  deleteActive: { type: 'delete active' },

  addingSong: { type: 'adding song' },

  syncFilesystem: { type: 'check files' }

}
