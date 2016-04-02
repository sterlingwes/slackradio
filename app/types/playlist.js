const find = require('lodash.find')
const shuffle = require('knuth-shuffle').knuthShuffle
const Song = require('./song')

function Playlist (songs, options, playing) {
  this.songs = songs
  this.length = this.songs.length
  this.playing = playing

  this.o = {
    activeIndex: 0,
    isPlaying: false,
    processingSong: false
  }
  Object.assign(this.o, options)
}

Playlist.prototype.get = function (index) {
  if (typeof index === 'undefined') return this.songs.slice(0)
  return this.songs[index]
}

Playlist.prototype.clone = function () {
  var list = new Playlist(this.songs.slice(0), Object.assign({}, this.o))
  if (this.playing) list.playing = this.playing
  return list
}

Playlist.prototype.add = function (song) {
  this.songs.push(song)
  this.o.processingSong = false
}

Playlist.prototype.setPlaying = function (index, playState) {
  if (typeof index !== 'undefined') this.setActiveIndex(index)
  var activeSong = this.songs[this.o.activeIndex]
  if (activeSong) {
    this.playing = activeSong.clone()
    this.o.isPlaying = typeof playState === 'undefined' ? true : playState
  }
}

Playlist.prototype.setSong = function (nextIndex) {
  if (!this.songs[nextIndex]) {
    nextIndex = 0
  }
  this.setPlaying(nextIndex)
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
  this.o.isPlaying = isPlaying
}

Playlist.prototype.togglePlayState = function () {
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
  shuffle(this.songs)
  this.setActiveById()
}

Playlist.prototype.sortById = function (order) {
  this.songs.sort((a, b) => {
    var aVal = order.indexOf(a.id)
    var bVal = order.indexOf(b.id)
    return (bVal === -1 ? 0 : bVal) - (aVal === -1 ? 0 : aVal)
  })
  this.setActiveById()
}

Playlist.prototype.toJSON = function () {
  return this.songs
}

Playlist.fromSongs = function (songs) {
  return new Playlist(songs.map(song => new Song(song)))
}

module.exports = Playlist
