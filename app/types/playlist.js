const find = require('lodash.find')
const shuffle = require('knuth-shuffle').knuthShuffle
const Song = require('./song')

function Playlist (songs, options, playing) {
  this.songs = songs
  this.length = this.songs.length
  this.playing = playing
  this.fetching = [] // array of song ids for in process loading

  this.o = {
    activeIndex: 0,
    isPlaying: false,
    processingSong: false
  }
  Object.assign(this.o, options)
}

Playlist.prototype.checkFiles = function () {
  this.songs.forEach(song => {
    song.checkExists()
  })
}

Playlist.prototype.get = function (index) {
  if (typeof index === 'undefined') return this.songs.slice(0)
  return this.songs[index]
}

Playlist.prototype.getLast = function () {
  var last = this.o.activeIndex - 1
  if (last < 0) last = this.songs.length - 1
  return this.songs[last]
}

Playlist.prototype.getNext = function () {
  var next = this.o.activeIndex + 1
  if (next >= this.songs.length) return this.songs[0]
  return this.songs[next]
}

Playlist.prototype.indexOf = function (songId) {
  var index = -1
  find(this.songs, function (song, i) {
    if (song.id === songId) {
      index = i
      return true
    }
  })
  return index
}

Playlist.prototype.findById = function (songId) {
  return find(this.songs, { id: songId })
}

Playlist.prototype.replace = function (song) {
  var index = this.indexOf(song.id)
  this.songs.splice(index, 1, song)
  if (this.playing && this.playing.id === song.id) {
    this.playing = song
  }
}

Playlist.prototype.clone = function () {
  var list = new Playlist(this.songs.slice(0), Object.assign({}, this.o))
  if (this.playing) list.playing = this.playing
  if (this.fetching.length) list.fetching = this.fetching.slice(0)
  return list
}

Playlist.prototype.add = function (song) {
  this.songs.push(song)
  this.o.processingSong = false
}

Playlist.prototype.fetched = function (songId) {
  var idx = this.fetching.indexOf(songId)
  if (idx !== -1) this.fetching.splice(idx, 1)
}

Playlist.prototype.isFetching = function (songId) {
  if (!songId) songId = this.playing.id
  return this.fetching.indexOf(songId) !== -1
}

Playlist.prototype.setPlaying = function (index, playState) {
  if (typeof index !== 'undefined') this.setActiveIndex(index)
  var activeSong = this.songs[this.o.activeIndex]
  if (activeSong) {
    this.playing = activeSong.clone()
    this.o.isPlaying = typeof playState === 'undefined' ? true : playState
  }
}

Playlist.prototype.setSong = function (nextIndex, playState) {
  if (!this.songs[nextIndex]) {
    nextIndex = 0
  }
  this.setPlaying(nextIndex, playState)
}

Playlist.prototype.setActiveIndex = function (index) {
  this.o.activeIndex = index || 0
}

Playlist.prototype.setActiveById = function (playingId) {
  playingId = playingId || this.playing.id
  find(this.songs, (song, i) => {
    this.o.activeIndex = i
    return song.id === playingId
  })
}

Playlist.prototype.setPlayState = function (isPlaying) {
  if (isPlaying && this.isFetching()) return
  this.o.isPlaying = isPlaying
}

Playlist.prototype.togglePlayState = function () {
  if (!this.o.isPlaying && this.isFetching()) return
  this.o.isPlaying = !this.o.isPlaying
}

Playlist.prototype.processing = function () {
  this.o.processingSong = true
}

Playlist.prototype.remove = function (currentIndex) {
  this.songs.splice(currentIndex, 1)
  if (this.o.activeIndex > currentIndex) {
    this.o.activeIndex--
  }
  if (!this.length) {
    this.playing = null
  }
}

Playlist.prototype.shuffle = function () {
  if (this.fetching.length) return console.warn('Cannot shuffle while fetching songs')
  shuffle(this.songs)
  this.setActiveById()
}

Playlist.prototype.sortById = function (order) {
  if (this.fetching.length) return console.warn('Cannot sort while fetching songs')
  this.songs.sort((a, b) => {
    var aVal = order.indexOf(a.id)
    var bVal = order.indexOf(b.id)
    return (bVal === -1 ? 0 : bVal) - (aVal === -1 ? 0 : aVal)
  })
  this.setActiveById()
}

Playlist.prototype.augment = function (songs) {
  this.songs = songs.map(song => new Song(song))
}

Playlist.prototype.toJSON = function () {
  return this.songs
}

Playlist.fromSongs = function (songs) {
  return new Playlist(songs.map(song => new Song(song)))
}

module.exports = Playlist
