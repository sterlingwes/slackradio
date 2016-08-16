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

  // app.authenticate().then(function () {
  //   console.log('auth', arguments)
  // })

  var slackService = app.service('slack')

  slackService.on('slackConnected', (data) => {
    console.log(data)
  })

  var hookService = app.service('slackhook')

  return {
    slack: slackService,
    hook: hookService
  }
}
