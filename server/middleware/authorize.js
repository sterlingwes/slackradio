const db = require('../db')

module.exports = function authorize (req, authorized) {
  const token = req.query.token
  let error

  if (!token) {
    error = new Error('Missing access token')
    console.error(error.message)
    return authorized(error)
  }

  db.users.findOne({ token: token }, (err, user) => {
    if (err) return authorized(err)
    if (!user || user.deauthorized) {
      error = new Error('Invalid access token')
      console.error(error.message)
      return authorized(error)
    }

    req.user = user
    authorized()
  })
}
