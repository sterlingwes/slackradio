const mapActions = require('../utils/mapActions')
const actions = require('./window.actions')

var initialState = {
  focused: true
}

function reducerFn (state = initialState, action) {
  var newState = Object.assign({}, state)

  switch (action.type) {
    case 'window focused':
      newState.focused = true
      break
    case 'window focus lost':
      newState.focused = false
      break
  }

  return newState
}

function init (store) {
  mapActions(actions, store)
}

module.exports = {fn: reducerFn, init: init}
