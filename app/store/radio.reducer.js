const mapActions = require('../utils/mapActions')
const actions = require('./radio.actions')
const _ = require('lodash')

var initialState = {}

function groupPlaylists (state, lists) {
  state = lists.reduce((hash, station) => {
    var team = hash[station.team_domain] = hash[station.team_domain] || []
    team.push(station)
    return hash
  }, state)
  state._length = _.without(Object.keys(state), '_length').length
  return state
}

function reducerFn (state = initialState, action) {

  switch (action.type) {
    case 'received playlists':
      state = groupPlaylists(state, action.lists.data)
      break

    case 'received additional playlists':
      state = groupPlaylists(_.extend({}, state), action.lists)
      break
  }

  return state
}

function init (store) {
  mapActions(actions, store)
}

module.exports = {fn: reducerFn, init: init}
