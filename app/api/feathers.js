/* globals io */
const feathers = require('feathers-client/dist/feathers')
const socket = io('http://localhost:3030')

const app = feathers()
  .configure(feathers.hooks())
  .configure(feathers.socketio(socket))

var slackService = app.service('slack')

slackService.on('token', () => {
})

module.exports = {
  slack: slackService
}
