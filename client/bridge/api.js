/* global fetch, Headers, Primus */
var HOST = 'http://localhost:8080'

var data = JSON.stringify({
  username: 'foo',
  password: 'bar'
})

var headers = new Headers()
headers.set('Content-Type', 'application/json')

var EventEmitter2 = require('eventemitter2').EventEmitter2
var api = new EventEmitter2()
api.login = login

module.exports = api

function login (user) {
  fetch(HOST + '/login', { method: 'POST', body: data, headers: headers })
    .then(function (res) {
      res.json().then(function (json) {
        if (!json.token) return console.warn('no token', json)
        connect(json.token)
      })
    })
}

function connect (token) {
  var primus = Primus.connect(HOST + '?token=' + token)

  primus.on('open', function open() {
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

  primus.write('FUCK')
}
