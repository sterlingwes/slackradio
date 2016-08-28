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
  var primus = Primus.connect(HOST + '?token=' + token)

  primus.on('open', function open () {
    console.log('Connection is alive and kicking');
  })

  primus.on('data', function message (data) {
    console.log('Received a new message from the server', data);
  })

  primus.on('error', function error (err) {
    console.error('Something horrible has happened', err.stack);
  })

  primus.on('reconnect', function (opts) {
    console.log('Reconnection attempt started');
  })

  primus.on('end', function () {
    console.log('Connection closed');
  })

  primus.write({ event: 'FUCK', message: 'FUCK' })
}
