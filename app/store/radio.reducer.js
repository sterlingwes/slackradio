const mapActions = require('../utils/mapActions')
const actions = require('./radio.actions')

var initialState = {
  stations: []
}

function reducerFn (state = initialState, action) {
  var newState = Object.assign({}, state)

  switch (action.type) {
  }

  return newState
}

function init (store) {
  mapActions(actions, store)
}

module.exports = {fn: reducerFn, init: init}
