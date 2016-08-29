const Datastore = require('nedb')
const _ = require('lodash')

const db = new Datastore({ filename: 'data/stations', autoload: true })

module.exports = _.extend(db, {})
