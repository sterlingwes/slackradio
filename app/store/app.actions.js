module.exports = {
  routeChange: function (path) {
    return { type: 'route changed', path: path }
  },

  sizeMedia: function (size) {
    return { type: 'size media', size: size }
  },

  slackConnected: function (user) {
    return { type: 'slack connected', user: user }
  },

  loadingPlaylists: function (isLoading) {
    return { type: 'loading playlists', isLoading: isLoading }
  }
}
