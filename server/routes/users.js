const router = require('express').Router()
const _ = require('lodash')
const db = require('../db')
const slack = require('../middleware/slack')

const fields = { userId: 1, accounts: 1 }

router.post('/', slack.authorize, (req, res, next) => {
  db.users.findOrCreate(req.slackUser, (err, user) => {
    if (err) return next(err)
    res.json(user)
  })
})

router.get('/', (req, res, next) => {
  db.users.find({}, fields, (err, users) => {
    if (err) return next(err)
    res.json(users)
  })
})

router.param('id', (req, res, next, id) => {
  db.users.findOne({ userId: id }, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(404).json({ error: 'User not found' })
    req.user = user
    next()
  })
})

function isConnected (req) {
  return _.find(req.user.accounts, { user_id: req.slackUser.user_id })
}

router.post('/:id/slack', slack.authorize, (req, res, next) => {
  if (!isConnected(req)) {
    db.users.addAccount(req.params.id, req.slackUser, (err) => {
      if (err) return next(err)
      db.users.findOne({ userId: req.params.id }, (_, user) => res.json(user))
    })
  } else {
    res.json(req.user)
  }
})

module.exports = router
