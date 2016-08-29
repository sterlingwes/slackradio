const _ = require('lodash')
const db = require('../db')

//
// save a station update ("sync")
//
exports.save = function (station) {
  db.stations.update({})
}
