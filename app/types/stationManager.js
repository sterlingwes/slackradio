const _ = require('lodash')
const Station = require('./station')

function StationManager (stations) {
  this.stations = stations.map(station => new Station(station))
  this.currentStation = null
}

StationManager.prototype.getById = function (id) {
  return _.find(this.stations, station => {
    return station.o._id === id
  })
}

StationManager.prototype.setCurrent = function (id) {
  this.currentStation = this.getById(id)
}

StationManager.prototype.clone = function () {
  var stations = this.stations.map(station => station.toJSON())
  var manager = new StationManager(stations)
  if (this.currentStation) {
    manager.currentStation = new Station(this.currentStation.toJSON())
  }
  return manager
}

module.exports = StationManager
