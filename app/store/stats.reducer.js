const storage = require('./storage')
const mapActions = require('../utils/mapActions')
const actions = require('./stats.actions')

const statsKey = 'playCounts'

var initialState = storage.read(statsKey, {
  songCounts: {},
  totalCount: 0
})

function reducerFn (state = initialState, action) {
  var newState = Object.assign({}, state)
  var songCounts = newState.songCounts = Object.assign({}, state.songCounts)

  switch (action.type) {
    case 'add count':
      if (!songCounts[action.id]) songCounts[action.id] = 0
      songCounts[action.id]++
      newState.totalCount++
      storage.write(statsKey, newState)
      break
  }

  return newState
}

function init (store) {
  mapActions(actions, store)
}

module.exports = {fn: reducerFn, init: init}
