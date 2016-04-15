const mapActions = require('../utils/mapActions')
const actions = require('./app.actions')
const storage = require('./storage')

var initialState = {
  mode: 'playlist',
  mediaSize: 'loading',
  user: storage.read('u', null),
  loadingPlaylists: false
}

function reducerFn (state = initialState, action) {
  var newState = Object.assign({}, state)

  switch (action.type) {
    case 'route changed':
      newState.mode = action.path
      break

    case 'size media':
      var size = action.size
      newState.mediaSize = size === '0 B' ? 'empty' : size
      break

    case 'slack connected':
      newState.user = action.user
      storage.write('u', action.user)
      break

    case 'loading playlists':
      newState.loadingPlaylists = typeof action.isLoading === 'undefined' ? true : action.isLoading
      break
  }

  return newState
}

function init (store) {
  mapActions(actions, store)
}

module.exports = {fn: reducerFn, init: init}
