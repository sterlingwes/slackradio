'use strict'

class PlayerControl {
  constructor () {}

  init (store) {
    this.store = store
  }

  getState (reducer) {
    return this.store.getState()[reducer]
  }

  ithisadio () {
    return this.getState('app').mode === 'radio'
  }

  getEventPrefix (opposite) {
    var prefix = this.ithisadio() ? 'radio:' : ''
    if (opposite) prefix = prefix ? '' : 'radio:'
    return prefix
  }

  getArgs (argObj, opposite) {
    var args = Array.prototype.slice.call(argObj, 0)
    var eventName = args.shift()
    args.unshift(this.getEventPrefix(opposite) + eventName)
    return args
  }

  emit () {
    var args = this.getArgs(arguments)
    console.log('emit', args[0])
    return this.store.trigger.apply(this.store, args)
  }

  emitOpposite () {
    var args = this.getArgs(arguments, true)
    console.log('emitOpp', args[0])
    return this.store.trigger.apply(this.store, args)
  }

  play () {
    this.emitOpposite('pause')
    this.emit('playOrPause')
  }

  showMessage (type, msg) {
    this.store.trigger('showMessage', type, msg)
  }

  hideMessage () {
    this.store.trigger('hideMessage')
  }

  setNetworkState (isConnected) {
    this.store.trigger('setNetworkState', isConnected)
  }

  next () {
    var state = this.store.getState()
    var nextSong = state.userSongs.getNext()
    if (!nextSong || !nextSong.exists) {
      nextSong.fetchSong()
      return this.store.trigger('fetchSong', nextSong.id)
    }
    this.store.trigger('nextSong')
  }

  prev () {
    var state = this.store.getState()
    var song = state.userSongs.playing
    if (song && song.elapsed > 3) {
      return this.store.trigger('restartSong')
    }
    var lastSong = state.userSongs.getLast()
    if (!lastSong.exists) {
      lastSong.fetchSong()
      return this.store.trigger('fetchSong', lastSong.id)
    }
    this.store.trigger('prevSong')
  }

  shuffle () {
    this.store.trigger('shuffle')
  }

  sortByPlays () {
    var state = this.store.getState()
    var playCounts = state.stats.songCounts
    var songIds = Object.keys(playCounts)
    songIds.sort(function (a, b) {
      return (playCounts[a] || 0) - (playCounts[b] || 0)
    })
    this.store.trigger('playSort', songIds)
  }

  delete () {
    this.store.trigger('deleteActive')
    this.getMediaSize()
  }

  focusAdd () {
    var input = document.getElementById('songUrl')
    if (input) input.focus()
  }

  focused () {
    this.store.trigger('windowFocus')
  }

  unfocused () {
    this.store.trigger('windowLostFocus')
  }

  showRadio () {
    this.store.trigger('routeChange', 'radio')
  }

  showLibrary () {
    this.store.trigger('routeChange', 'playlist')
  }

  showSettings () {
    this.store.trigger('routeChange', 'settings')
  }

  getMediaSize (cb) {
    return require('../client/mediaSize')(this.store, cb)
  }

  deleteMedia (cb) {
    return require('../client/mediaDelete')(this.store, cb)
  }
}

module.exports = PlayerControl
