const mapActions = require('../utils/mapActions')
const actions = require('./app.actions')

var initialState = {
  mode: 'playlist'
}

function reducerFn (state = initialState, action) {
  var newState = Object.assign({}, state)

  switch (action.type) {
    case 'route changed':
      newState.mode = action.path
      break
  }

  return newState
}

function init (store) {
  mapActions(actions, store)
}

module.exports = {fn: reducerFn, init: init}
