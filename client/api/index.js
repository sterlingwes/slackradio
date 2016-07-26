/* globals io, HOST, SlackRadio */

var noop = function () {}

var stubService = {
  on: noop,
  emit: noop
}

var stub = {
  slack: stubService
}

/*
  * attempt to authenticate against the API
  * we try to use stored credentials from localStorage
  *
  * returns a promise
  */
function authenticate (app) {
  return function () {
    var creds = window.localStorage.getItem('u')
    var err

    try {
      creds = JSON.parse(creds)
    } catch (e) { err = e }

    if (!creds || err) return Promise.reject(err || 'No credentials')

    return app.authenticate({
      type: 'local',
      email: creds.user_id,
      password: creds.access_token
    })
  }
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

  // socket.on('reconnecting', function (e) {
  //   SlackRadio.setNetworkState(false)
  // })

  socket.on('reconnect', function (e) {
    SlackRadio.hideMessage('connectionLost')
    authenticate()
  })

  socket.on('reconnect_error', function (e) {
    SlackRadio.showMessage('connectionLost')
  })

  socket.on('disconnect', function (e) {
    SlackRadio.setNetworkState(false)
  })

  return {
    authenticate: authenticate(app),
    playlists: app.service('playlists'),
    slack: app.service('slack'),
    hook: app.service('slackhook')
  }
}
