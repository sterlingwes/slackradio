const mapActions = require('../utils/mapActions')
const actions = require('./media.actions')

var initialState = {}

function reducerFn (state = initialState, action) {
  switch (action.type) {
    case 'media indexed':
      state = action.mediaInfo
      var size = action.mediaInfo.total
      state.total = size === '0 B' ? 'empty' : size
      break
  }

  return state
}

function init (store) {
  mapActions(actions, store)
}

module.exports = {fn: reducerFn, init: init}
