const PORT = 8080

const authorize = require('./middleware/authorize')
const allowCors = require('./middleware/allowCors')
const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const Primus = require('primus')

const app = express()

app.use(allowCors)
app.use(bodyParser.json())

app.post('/login', require('./routes/login'))
app.use('/users', require('./routes/users'))

//
// Create an HTTP server and our Primus server.
//
const server = http.createServer(app)
const primus = new Primus(server, {
  pathname: 'rt',
  transformer: 'engine.io'
})

//
// Add the authorization hook.
//
primus.authorize(authorize)

//
// `connection` is only triggered if the authorization succeeded.
//
primus.on('connection', function connection (spark) {
  spark.on('data', function received (data) {
    console.log(spark.id, 'received message:', data)

    //
    // Echo back to the client any received data.
    //
    spark.write(data)
  })
})

//
// Begin accepting connections.
//
server.listen(PORT, function listening () {
  console.log('server listening on port', PORT)
})

module.exports.server = server
