module.exports = {
  receivedPlaylists: function (playlists) {
    return { type: 'received playlists', lists: playlists }
  },

  playlistsAdded: function (playlists) {
    return { type: 'received additional playlists', lists: playlists }
  }
}
