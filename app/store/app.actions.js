module.exports = {
  routeChange: function (path) {
    return { type: 'route changed', path: path }
  }
}
