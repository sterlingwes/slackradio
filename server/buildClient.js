const server = require('./index').server
const fs = require('fs')

const library = server.library()

fs.writeFileSync('client/bridge/primus.js', library)

console.log('---')
console.log('> Written to client/bridge/primus.js')

process.exit()
