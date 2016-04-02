import { mapStateSubset } from '../store/riotRedux.mixin'

var instance

function AudioElement (store) {
  var audioTag
  var currentSrc
  var lastTrackedId

  this.state = {}

  this.play = function () {
    var src = this.state.song.getFile()
    if (currentSrc !== src) {
      this.setSrc(src)
    }

    audioTag.play()
  }

  this.setSrc = function (src) {
    currentSrc = audioTag.src = src
  }

  this.pause = function () {
    audioTag.pause()
  }

  this.onTime = function () {
    var pct = audioTag.currentTime / audioTag.duration
    var elapsedPct = Math.ceil(pct * 100)
    var song = this.state.song
    if (elapsedPct > 75 && song && song.id !== lastTrackedId) {
      lastTrackedId = this.state.song.id
      store.trigger('trackPlay', lastTrackedId)
    }
    if (this.state.focused) {
      store.trigger('elapsed', elapsedPct)
    }
  }

  this.onError = function (e) {
    console.error('<audio>', e)
  }

  this.onEnd = function () {
    store.trigger('nextSong')
  }

  this.onReset = function () {
    if (currentSrc !== audioTag.src && this.state.isPlaying) {
      this.play()
    }
  }

  this.handleChange = function () {
    if (this.state.isPlaying) {
      this.play()
    } else {
      this.pause()
    }
  }

  this.update = function (state) {
    Object.assign(this, state)
    this.handleChange()
  }

  this.init = function () {
    if (!audioTag) {
      audioTag = document.getElementById('audioEl')
      audioTag.addEventListener('timeupdate', this.onTime.bind(this))
      audioTag.addEventListener('ended', this.onEnd.bind(this))
      audioTag.addEventListener('emptied', this.onReset.bind(this))
      audioTag.addEventListener('error', this.onError.bind(this))

      mapStateSubset.call(this, {
        isPlaying: 'songs.isPlaying',
        song: 'songs.playing',
        focused: 'window.focused'
      })
    }
  }

  store.on('restartSong', function () {
    audioTag.currentTime = 0
  })

  this.init()
}

module.exports = function (store) {
  if (instance) return instance
  instance = new AudioElement(store)
  return instance
}
