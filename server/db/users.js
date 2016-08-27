const Datastore = require('nedb')
const db = new Datastore({ filename: 'data/users', autoload: true })

const bcrypt = require('bcrypt')

module.exports = db

exports.createUser = function createUser (profile, cb) {
  bcrypt.hash(profile.password, 10, (err, hash) => {
    if (err) throw err
    profile.password = hash
    db.insert(profile, cb)
  })
}

exports.getUser = function getUser (username, cb) {
  db.findOne({ username: username }, cb)
}
