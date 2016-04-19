module.exports = {
  receivedPlaylists: function (playlists) {
    return { type: 'received playlists', lists: playlists }
  },

  updateStation: function (station) {
    return { type: 'received playlist', list: station }
  },

  playStation: function (id) {
    return { type: 'play station', id: id }
  }
}
