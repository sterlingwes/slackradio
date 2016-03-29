const Song = require('../types/song')
const storage = require('./storage')
const mapActions = require('../utils/mapActions')
const actions = require('./playlist.actions')
const shuffle = require('knuth-shuffle').knuthShuffle
const find = require('lodash.find')

const playlistKey = 'playlist'

var initialState = {
  playlist: storage.read(playlistKey).map(song => new Song(song)),
  isPlaying: false,
  activeIndex: 0,
  processingSong: false
}

function pickSong (newState, nextIndex) {
  if (!newState.playlist[nextIndex]) {
    nextIndex = 0
  }
  newState.activeIndex = nextIndex
  newState.playing = newState.playlist[nextIndex]
}

function reducerFn (state = initialState, action) {
  var newState = Object.assign({}, state)
  if (state.playing) {
    newState.playing = state.playing.clone()
  }

  switch (action.type) {
    case 'choose song':
      newState.playing = state.playlist[action.index]
      newState.activeIndex = action.index
      break

    case 'next song':
      var nextIndex = state.activeIndex + 1
      pickSong(newState, nextIndex)
      break

    case 'last song':
      var lastIndex = (state.activeIndex || state.playlist.length) - 1
      pickSong(newState, lastIndex)
      break

    case 'pick song':
      pickSong(newState, action.index)
      newState.isPlaying = true
      break

    case 'song progress':
      newState.playing.setElapsed(action.percent)
      break

    case 'adding song':
      newState.processingSong = true
      break

    case 'add song':
      var list = newState.playlist.slice(0)
      list.push(action.song)
      newState.playlist = list
      newState.processingSong = false
      storage.write(playlistKey, list) // probably shouldn't do this here...
      break

    case 'play':
      newState.isPlaying = true
      break

    case 'pause':
      newState.isPlaying = false
      break

    case 'toggle play':
      newState.isPlaying = !newState.isPlaying
      break

    case 'shuffle':
      newState.playlist = shuffle(state.playlist.slice(0))
      find(newState.playlist, (song, i) => {
        newState.activeIndex = i
        return song.id === newState.playing.id
      })
      storage.write(playlistKey, newState.playlist)
      break

    case 'delete active':
      var currentIndex = state.activeIndex
      var index = state.activeIndex + 1
      pickSong(newState, index)
      newState.playlist = state.playlist.slice(0)
      newState.playlist.splice(currentIndex, 1)
      if (newState.activeIndex > currentIndex) {
        newState.activeIndex--
      }
      if (!newState.playlist.length) {
        newState.playing = null
      }
      storage.write(playlistKey, newState.playlist)
      break
  }

  return newState
}

function init (store) {
  mapActions(actions, store)

  window.SlackRadio.ipc.on('acquiredSong', function (e, song) {
    store.dispatch({ type: 'add song', song: new Song(song) })
    store.trigger('processedSong')
  })
}

module.exports = {fn: reducerFn, init: init}
