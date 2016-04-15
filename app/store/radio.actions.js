module.exports = {
  receivedPlaylists: function (playlists) {
    return { type: 'received playlists', lists: playlists }
  },

  setStation: function (id) {
    return { type: 'station picked', id: id }
  }
}
