const Playlist = require('../types/playlist')
const Song = require('../types/song')
const storage = require('./storage')
const mapActions = require('../utils/mapActions')
const actions = require('./playlist.actions')

const playlistKey = 'playlist'

var initialState = Playlist.fromSongs(storage.read(playlistKey))

function reducerFn (state = initialState, action) {
  var playlist = state.clone()

  switch (action.type) {
    case 'choose song':
      playlist.setPlaying(action.index, false)
      break

    case 'next song':
      var nextIndex = playlist.o.activeIndex + 1
      playlist.setSong(nextIndex)
      break

    case 'last song':
      var lastIndex = (playlist.o.activeIndex || playlist.length) - 1
      playlist.setSong(lastIndex)
      break

    case 'pick song':
      playlist.setSong(action.index, action.play)
      break

    case 'song progress':
      playlist.playing.setElapsed(action.percent)
      break

    case 'adding song':
      playlist.processing()
      break

    case 'add song':
      playlist.add(action.song)
      storage.write(playlistKey, playlist) // probably shouldn't do this here...
      break

    case 'fetch song':
      playlist.fetching.push(action.id)
      break

    case 'fetched song':
      playlist.fetched(action.id)
      var updatedSong = playlist.findById(action.id)
      if (updatedSong) updatedSong.exists = true
      if (playlist.playing && playlist.playing.id === action.id) {
        playlist.setPlayState(true)
      }
      break

    case 'play':
      playlist.setPlayState(true)
      break

    case 'pause':
      playlist.setPlayState(false)
      break

    case 'toggle play':
      playlist.togglePlayState()
      break

    case 'shuffle':
      playlist.shuffle()
      storage.write(playlistKey, playlist)
      break

    case 'sort by play count':
      playlist.sortById(action.order)
      storage.write(playlistKey, playlist)
      break

    case 'delete active':
      var currentIndex = playlist.o.activeIndex
      var index = playlist.o.activeIndex + 1
      playlist.setSong(index)
      playlist.remove(currentIndex)
      storage.write(playlistKey, playlist)
      break
  }

  return playlist
}

function init (store) {
  mapActions(actions, store)

  window.SlackRadio.ipc.on('fetchedSong', function (e, song) {
    var updatedSong = new Song(song)
    store.trigger('fetchedSong', updatedSong.id)
  })

  window.SlackRadio.ipc.on('acquiredSong', function (e, song) {
    store.dispatch({ type: 'add song', song: new Song(song) })
    store.trigger('processedSong')
  })
}

module.exports = {fn: reducerFn, init: init}
