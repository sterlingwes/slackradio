//
// Require all dependencies.
//
const bcrypt = require('bcrypt')

//
// Dummy database.
//
const users = Object.create(null)

//
// Add a user for our example.
//
bcrypt.hash('bar', 10, (err, hash) => {
  if (err) throw err

  users.foo = {
    username: 'foo',
    password: hash
  }
})

//
// Expose a function to get a user by username.
//
exports.getUser = function getUser (username) {
  return users[username]
}
