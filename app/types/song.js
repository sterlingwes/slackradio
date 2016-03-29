const pick = require('lodash.pick')

const paramKeys = [
  'id',
  'ext',
  'title', 'fulltitle',
  'creator',
  'duration',
  'extractor',
  'thumbnail'
]

function Song (params) {
  this.id = params.id
  this.elapsed = 0

  this.o = pick(params, paramKeys)

  this.parseTitle()
  this.parseFilename()
  this.parseTime()
}

Song.prototype.parseTitle = function () {
  var title = this.o.title || this.o.fulltitle
  title = title.split(/\s+-\s+/)
  this.artist = title[0]
  this.artist = this.o.creator || this.artist
  this.title = title[1] || title[0]
}

Song.prototype.parseFilename = function () {
  this.filename = this.getTypePrefix() + this.id + '.' + this.o.ext
}

Song.prototype.parseTime = function () {
  this.time = Math.ceil(this.o.duration / 60 * 100) / 100
  this.prettyTime = this.time.toString().split('.').join(':')
  if (/:[0-9]$/.test(this.prettyTime)) this.prettyTime += '0'
}

Song.prototype.getTypePrefix = function () {
  switch (this.o.extractor) {
    case 'youtube':
      return 'yt-'
    default:
      return this.o.extractor + '-'
  }
}

Song.prototype.getArtist = function () {
  return this.artist
}

Song.prototype.getTitle = function () {
  return this.title
}

Song.prototype.getFile = function () {
  return '../media/' + this.filename
}

Song.prototype.getTime = function () {
  return this.prettyTime
}

Song.prototype.getThumb = function () {
  return this.o.thumbnail
}

Song.prototype.getMime = function () {
  return 'audio/' + this.o.ext
}

Song.prototype.setElapsed = function (pct) {
  this.elapsed = pct
}

Song.prototype.clone = function () {
  var song = new Song(this.toJSON())
  song.setElapsed(this.elapsed)
  return song
}

Song.prototype.toJSON = function () {
  return this.o
}

module.exports = Song
