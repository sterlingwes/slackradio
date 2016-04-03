/* globals SlackRadio */
const pick = require('lodash.pick')
const c = require('../constants')

const paramKeys = [
  'id',
  'ext',
  'title', 'fulltitle',
  'creator',
  'duration',
  'extractor',
  'thumbnail',
  'webpage_url'
]

function Song (params) {
  this.id = params.id
  this.elapsed = 0
  this.exists = false

  this.o = pick(params, paramKeys)

  this.parseTitle()
  this.parseFilename()
  this.parseTime()

  this.checkExists() // depends on filename parsing
}

Song.prototype.parseTitle = function () {
  var title = this.o.title || this.o.fulltitle

  // split our title on common delimiters
  var delims = c.songTitle.delimiters.map(delim => `\\${delim}`).join('|')
  var splitRgx = new RegExp(`[${delims}]`)
  title = title.split(splitRgx)

  this.artist = title[0]
  this.artist = this.o.creator || this.artist
  this.title = title[1] || title[0]

  // strip common 'tags'
  var replaceables = c.songTitle.removable.join('|')
  var replaceRgx = new RegExp(`[\\{\\(\\[]?(${replaceables})[\\]\\)\\}]?`, 'i')
  this.title = this.title.replace(replaceRgx, '')

  if (this.artist === this.title) this.artist = ''
}

Song.prototype.printTitle = function () {
  var title = this.artist
  if (title) title += ' - '
  title += this.title
  return title
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

Song.prototype.checkExists = function () {
  var result
  try {
    result = SlackRadio.fs.statSync('media/' + this.filename)
  } catch (e) {}
  if (result) this.exists = true
}

Song.prototype.getUrl = function () {
  if (this.o.webpage_url) return this.o.webpage_url
  return 'https://www.youtube.com/watch?v=' + this.id
}

Song.prototype.fetchSong = function () {
  SlackRadio.ipc.send('fetchSong', this.getUrl())
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
