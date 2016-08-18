const Server = require('./index').Server
const fs = require('fs')

const library = Server.library()

fs.writeFileSync('client/bridge/primus.js', library)

console.log('---')
console.log('> Written to client/bridge/primus.js')

process.exit()
