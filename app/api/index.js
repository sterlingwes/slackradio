const api = 'http://localhost:3030'

function scriptOnLoad () {
  return function () {
    console.info('Loaded Socket.io')
    require('./feathers')
  }
}

var sio = document.createElement('script')
sio.onload = scriptOnLoad()
sio.src = api + '/socket.io/socket.io.js'
document.body.appendChild(sio)
