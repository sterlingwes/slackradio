const storage = require('./storage')
const mapActions = require('../utils/mapActions')
const actions = require('./stats.actions')
const values = require('lodash.values')

const statsKey = 'playCounts'

var initialState = storage.read(statsKey, {
  songCounts: {},
  maxCount: 0
})

if (!initialState.maxCount) {
  initialState.maxCount = Math.max.apply(Math, values(initialState.songCounts))
}

function reducerFn (state = initialState, action) {
  var newState = Object.assign({}, state)
  var songCounts = newState.songCounts = Object.assign({}, state.songCounts)

  switch (action.type) {
    case 'add count':
      if (!songCounts[action.id]) songCounts[action.id] = 0
      songCounts[action.id]++
      if (state.songCounts[action.id] > newState.maxCount) {
        newState.maxCount++
      }
      storage.write(statsKey, newState)
      break
  }

  return newState
}

function init (store) {
  mapActions(actions, store)
}

module.exports = {fn: reducerFn, init: init}
