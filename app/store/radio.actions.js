module.exports = {
  receivedPlaylists: function (playlists) {
    return { type: 'received playlists', lists: playlists }
  }
}
