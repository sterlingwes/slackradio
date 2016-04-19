const _ = require('lodash')
const Station = require('./station')

function getStationList (stations) {
  return stations.reduce((hash, station) => {
    var team = station.o.team_domain
    var channels = hash[team] = hash[team] || []
    channels.push({
      id: station.getId(),
      name: station.getName()
    })
    return hash
  }, {})
}

function StationManager (stations) {
  this.stations = stations.map(station => new Station(station))
  this.stationList = getStationList(this.stations)
  this.currentStation = null
}

StationManager.prototype.getById = function (id, returnIndex) {
  var index
  var found = _.find(this.stations, (station, i) => {
    index = i
    return station.o._id === id
  })
  return returnIndex ? index : found
}

StationManager.prototype.getIndex = function (id) {
  return this.getById(id, true)
}

StationManager.prototype.updatePlaylist = function (station) {
  var index = this.getIndex(station._id)
  this.stations[index] = new Station(station)
}

StationManager.prototype.setCurrent = function (id) {
  this.currentStation = this.getById(id)
  this.currentStation.play()
}

StationManager.prototype.clone = function () {
  var stations = this.stations.map(station => station.toJSON())
  var manager = new StationManager(stations)
  if (this.currentStation) {
    manager.currentStation = this.currentStation.clone()
  }
  return manager
}

module.exports = StationManager
