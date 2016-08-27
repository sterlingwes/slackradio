const router = require('express').Router()
const db = require('../db')

router.post('/', (req, res, next) => {
  db.users.createUser(req.body, (err, user) => {
    if (err) return next(err)
    res.json(user)
  })
})

router.get('/', (req, res, next) => {
  db.users.find({}, { username: 1 }, (err, users) => {
    if (err) return next(err)
    res.json(users)
  })
})

module.exports = router
