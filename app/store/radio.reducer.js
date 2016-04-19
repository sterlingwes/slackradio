const mapActions = require('../utils/mapActions')
const actions = require('./radio.actions')

var initialState = {}

function reducerFn (state = initialState, action) {

  switch (action.type) {
    case 'received playlists':
      state = action.lists.data.reduce((hash, station) => {
        var team = hash[station.team_domain] = hash[station.team_domain] || []
        team.push(station)
        return hash
      }, {})
      state._length = Object.keys(state).length
      break
  }

  return state
}

function init (store) {
  mapActions(actions, store)
}

module.exports = {fn: reducerFn, init: init}
