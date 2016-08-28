const Datastore = require('nedb')
const _ = require('lodash')

const db = new Datastore({ filename: 'data/users', autoload: true })

const slackFields = ['user_id', 'team_id', 'team_name', 'user']

module.exports = _.extend(db, {
  createUser,
  findOrCreate,
  addAccount,
  getUser
})

function createUser (profile, cb) {
  const user = {
    userId: profile.user_id,
    password: profile.access_token,
    accounts: [
      _.pick(profile, slackFields)
    ]
  }
  db.insert(user, cb)
}

function findOrCreate (profile, cb) {
  db.findOne({ userId: profile.user_id }, (err, user) => {
    if (err) return cb(err)
    if (user) return cb(null, user)
    createUser(profile, cb)
  })
}

function addAccount (userId, profile, cb) {
  db.update({ userId: userId }, {
    $push: {
      accounts: _.pick(profile, slackFields)
    }
  }, cb)
}

function getUser (username, cb) {
  db.findOne({ username: username }, cb)
}
