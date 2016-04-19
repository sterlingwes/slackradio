const mapActions = require('../utils/mapActions')
const actions = require('./app.actions')
const storage = require('./storage')
const messages = require('../constants').messages

var initialState = {
  mode: 'radio',
  source: 'playlist',
  mediaSize: 'loading',
  user: storage.read('u', null),
  loadingPlaylists: false,
  connected: false,
  flashMessageId: '',
  flashMessage: '',
  flashType: '',
  flashLastDismissed: ''
}

function reducerFn (state = initialState, action) {
  var newState = Object.assign({}, state)

  switch (action.type) {
    case 'route changed':
      newState.mode = action.path
      break

    case 'set source':
      newState.source = action.source
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

    case 'set network state':
      newState.connected = action.isConnected
      break

    case 'show flash message':
      if (action.msg === newState.flashLastDismissed) return newState // no-op
      var msg = messages[action.msg]
      if (!msg) msg = messages.unknown
      return Object.assign(newState, {
        flashMessage: msg[1],
        flashMessageId: action.msg,
        flashType: action.level || msg[0]
      })

    case 'hide flash message':
      if (action.msg && newState.flashMessageId !== action.msg) return newState
      return Object.assign(newState, {
        flashMessage: '',
        flashMessageId: '',
        flashtype: '',
        flashLastDismissed: newState.flashMessageId
      })
  }

  return newState
}

function init (store) {
  mapActions(actions, store)
}

module.exports = {fn: reducerFn, init: init}
