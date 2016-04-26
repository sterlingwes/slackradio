/* globals io, HOST, SlackRadio */

var noop = function () {}

var stubService = {
  on: noop,
  emit: noop
}

var stub = {
  slack: stubService
}

module.exports = function () {
  if (typeof io === 'undefined') {
    //
    // need to handle this case
    //
    console.warn('no socket.io, so no server connection!')
    return stub
  }

  const feathers = require('feathers-client/dist/feathers')
  const socket = io(HOST)

  const app = feathers()
    .configure(feathers.hooks())
    .configure(feathers.socketio(socket))
    .configure(feathers.authentication({ storage: window.localStorage }))

  socket.on('connect', function () {
    SlackRadio.setNetworkState(true)
  })

  socket.on('error', function (e) {
    SlackRadio.setNetworkState(false)
    console.error('Socket Error', e)
  })

  socket.on('reconnect', function (e) {
    console.warn(e)
  })

  // socket.on('reconnecting', function (e) {
  //   SlackRadio.setNetworkState(false)
  // })

  socket.on('reconnect', function (e) {
    SlackRadio.hideMessage('connectionLost')
  })

  socket.on('reconnect_error', function (e) {
    SlackRadio.showMessage('connectionLost')
  })

  socket.on('disconnect', function (e) {
    SlackRadio.setNetworkState(false)
  })

  var slackService = app.service('slack')
  var hookService = app.service('slackhook')
  var playlistService = app.service('playlists')

  function authenticate () {
    var creds = window.localStorage.getItem('u')
    try {
      creds = JSON.parse(creds)
    } catch (e) { return Promise.reject(e) }

    return app.authenticate({
      type: 'local',
      email: creds.user_id,
      password: creds.access_token
    })
  }

  return {
    authenticate: authenticate,
    playlists: playlistService,
    slack: slackService,
    hook: hookService
  }
}
