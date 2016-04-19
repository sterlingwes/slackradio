import { mapStateSubset } from '../store/riotRedux.mixin'

var instance = {}

class AudioElement {
  constructor (srcType, store) {
    this.state = {}
    this.type = srcType

    if (!this.audioTag) {
      this.audioTag = document.getElementById(srcType + 'AudioEl')
      this.audioTag.addEventListener('timeupdate', this.onTime.bind(this))
      this.audioTag.addEventListener('ended', this.onEnd.bind(this))
      this.audioTag.addEventListener('emptied', this.onReset.bind(this))
      this.audioTag.addEventListener('error', this.onError.bind(this))

      mapStateSubset.call(this, {
        isPlaying: srcType === 'radio' ? 'radio.currentStation.playlist.o.isPlaying' : 'userSongs.o.state.isPlaying',
        song: srcType === 'radio' ? 'radio.currentStation.playlist.playing' : 'userSongs.playing',
        focused: 'window.focused'
      })
    }

    store.on('restartSong', function () {
      this.audioTag.currentTime = 0
    })

    this.store = store
  }

  play () {
    var src = this.state.song.getFile()
    if (this.currentSrc !== src) {
      this.setSrc(src)
    }

    this.audioTag.play()
  }

  pause () {
    this.audioTag.pause()
  }

  setSrc (src) {
    this.currentSrc = this.audioTag.src = src
  }

  onTime () {
    var pct = this.audioTag.currentTime / this.audioTag.duration
    var elapsedPct = Math.ceil(pct * 100)
    var song = this.state.song
    if (elapsedPct > 75 && song && song.id !== this.lastTrackedId) {
      this.lastTrackedId = song.id
      this.store.trigger('trackPlay', this.lastTrackedId)
    }
    if (this.state.focused) {
      this.store.trigger('elapsed', elapsedPct)
    }
  }

  onError (e) {
    console.error('<audio>', e)
  }

  onEnd () {
    var state = this.store.getState()
    var nextSong = state.userSongs.getNext()
    if (!nextSong || !nextSong.exists) {
      nextSong.fetchSong()
      return this.store.trigger('fetchSong', nextSong.id)
    }
    this.store.trigger('nextSong')
  }

  onReset () {
    if (this.currentSrc !== this.audioTag.src && this.state.isPlaying) {
      this.play()
    }
  }

  handleChange () {
    if (this.state.isPlaying) {
      this.play()
    } else {
      this.pause()
    }
  }

  update (state) {
    Object.assign(this, state)
    this.handleChange()
  }
}

module.exports = function (type, store) {
  if (instance[type]) return instance[type]
  instance[type] = new AudioElement(type, store)
  return instance[type]
}
