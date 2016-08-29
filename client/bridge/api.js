/* global fetch, Headers, Primus, localStorage */
var HOST = 'http://localhost:8080'

var headers = new Headers()
headers.set('Content-Type', 'application/json')

var EventEmitter2 = require('eventemitter2').EventEmitter2
var api = new EventEmitter2()
api.login = login

module.exports = api

api.on('slack.connect', function (data) {
  console.log('logging in with code', data)
  login(data.code)
})

api.send = function (event, payload) {
  if (api.socket) {
    api.socket.write({ event: event, payload: payload })
  } else {
    console.warn('should queue event', event, payload)
  }
}

var connected = false
var connecting = false
var initialUser = localStorage.getItem('user')
try { initialUser = JSON.parse(initialUser) } catch (e) {}

if (initialUser && initialUser.token) {
  connect(initialUser.token)
}

function login (slackCode) {
  var payload = JSON.stringify({ code: slackCode })
  fetch(HOST + '/users', { method: 'POST', body: payload, headers: headers })
    .then(function (res) {
      res.json().then(function (user) {
        if (!user.token) return console.warn('no token', user)
        localStorage.setItem('user', JSON.stringify(user))
        connect(user.token)
      })
    })
}

function connect (token) {
  if (connecting || connected) return
  connecting = true

  var primus = Primus.connect(HOST + '?token=' + token)
  api.socket = primus
  console.log('socket.connecting...')

  primus.on('open', function open () {
    console.log('socket.open')
    connected = true
    connecting = false
  })

  primus.on('data', function message (data) {
    console.log('socket.data', data)
  })

  primus.on('error', function error (err) {
    console.error('Something horrible has happened', err.stack)
    connecting = false
    connected = false
  })

  primus.on('reconnect', function (opts) {
    console.log('socket.reconnect')
    connected = false
  })

  primus.on('end', function () {
    console.log('socket.end')
    connected = false
  })
}
