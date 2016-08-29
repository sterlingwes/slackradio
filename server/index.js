const PORT = 8080

require('dotenv').config()

const authorize = require('./middleware/authorize')
const allowCors = require('./middleware/allowCors')
const errorHandler = require('./middleware/errors')
const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const Primus = require('primus')
const eventHandlers = require('./events')

const app = express()

app.use(allowCors)
app.use(bodyParser.json())

app.use('/users', require('./routes/users'))

// must be last
app.use(errorHandler)

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

function getEventHandler (resource, method) {
  const handlers = eventHandlers[resource]
  if (handlers && handlers[method]) return handlers[method]
}

//
// `connection` is only triggered if the authorization succeeded.
//
primus.on('connection', function connection (spark) {
  const { userId } = spark.request.user
  console.log('connect:', userId, spark.id)

  spark.on('data', function received (data) {
    console.log('event:', data.event, userId, spark.id)

    const eventParts = data.event.split('.')
    const handler = getEventHandler.apply(null, eventParts)

    if (!handler) {
      console.warn('? No matching event handler:', data.event)
      return spark.write({ event: 'error', message: `Unknown event type "${data.event}"` })
    }

    //
    // event handlers are bound to the current spark and passed the event payload
    //
    handler.call(spark, data.payload)
  })
})

//
// Begin accepting connections.
//
server.listen(PORT, function listening () {
  console.log('server listening on port', PORT)
})

module.exports.server = server
