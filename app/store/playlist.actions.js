module.exports = {

  queueSong: function (index) {
    return {
      type: 'choose song',
      index: index
    }
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

  fetchedSong: function (song) {
    return { type: 'fetched song', song: song }
  },

  shuffle: { type: 'shuffle' },

  playSort: function (order) {
    return { type: 'sort by play count', order: order }
  },

  deleteActive: { type: 'delete active' },

  addingSong: { type: 'adding song' },

  syncFilesystem: { type: 'check files' },

  loadStation: function (id) {
    return { type: 'load station', id: id }
  },

  changePlaylist: function (playlist) {
    return { type: 'change playlist', playlist: playlist }
  },

  augmentPlaylist: function (playlist) {
    return { type: 'augment playlist', playlist: playlist }
  },

  loadUserPlaylist: { type: 'load user playlist' }

}
