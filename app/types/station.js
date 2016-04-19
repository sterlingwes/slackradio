const _ = require('lodash')
const Playlist = require('./playlist')

function Station (station, playlist) {
  this.o = {}
  this.playlist = playlist || Playlist.fromSongs(station.songs)
  delete station.songs
  _.extend(this.o, station)
}

Station.prototype.getName = function () {
  return this.o.channel_name
}

Station.prototype.getId = function () {
  return this.o._id
}

Station.prototype.getCurrentIndex = function () {
  return this.o.current.index
}

Station.prototype.play = function () {
  this.playlist.setSong(this.getCurrentIndex(), true)
}

Station.prototype.toJSON = function () {
  var station = this.o
  station.songs = this.playlist.toJSON()
  return station
}

Station.prototype.clone = function () {
  return new Station(this.o, this.playlist.clone())
}

Station.map = function (stations) {
  return stations.map(station => new Station(station))
}

module.exports = Station
