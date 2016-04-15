const mapActions = require('../utils/mapActions')
const actions = require('./radio.actions')
const StationManager = require('../types/stationManager')

var initialState = {}

function reducerFn (state = initialState, action) {
  if ('clone' in state) state = state.clone()

  switch (action.type) {
    case 'received playlists':
      state = new StationManager(action.lists.data)
      break

    case 'station picked':
      state.setCurrent(action.id)
      break
  }

  return state
}

function init (store) {
  mapActions(actions, store)
}

module.exports = {fn: reducerFn, init: init}
