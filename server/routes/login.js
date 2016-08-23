//
// Require all dependencies.
//
const authorize = require('../middleware/authorize')
const db = require('../db')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt')

//
// Handle authentication requests.
//
module.exports = function login (req, res) {
  //
  // For simplicity we don't validate received data here.
  //
  var user = db.getUser(req.body.username)

  if (!user) return res.status(401).send({ message: 'Bad credentials' })

  //
  // Check user's password and if it is correct return an authorization token.
  //
  bcrypt.compare(req.body.password, user.password, (err, ok) => {
    console.log(user.password, ok)

    if (err) {
      console.error(err)
      return res.status(500).send({ message: 'Internal error' })
    }

    if (!ok) return res.status(401).send({ message: 'Bad credentials' })

    var timestamp = Date.now()

    //
    // Create a JSON Web Token.
    //
    var token = jwt.encode({
      exp: timestamp + 10 * 60 * 1000, // Expiration Time.
      iat: timestamp, // Issued at.
      iss: user.username // Issuer.
    }, authorize.secret)

    res.send({ token: token })
  })
}
