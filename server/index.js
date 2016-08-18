const Primus = require('primus')

const Server = Primus.createServer(spark => {
  spark.write({ foo: 'bar' })
}, {
  port: 8080,
  pathname: 'rt',
  transformer: 'engine.io'
})

module.exports.Server = Server
