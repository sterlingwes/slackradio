<audio-player>
  <audio src={ opts.song.getFile() }></audio>

  <script>
    var audioTag
    var currentSrc
    
    this.mixin('redux')
    this.use({
      isPlaying: 'songs.isPlaying'
    })

    this.play = function () {
      if (audioTag) audioTag.play()
      currentSrc = audioTag.src
    }
    
    this.pause = function () {
      if (audioTag) audioTag.pause()
    }

    this.onTime = function () {
      var tracks = audioTag.played
      var pct = audioTag.currentTime / audioTag.duration
      var elapsedPct = Math.ceil(pct * 100)
      this.store.trigger('elapsed', elapsedPct)
    }
    
    this.onError = function (e) {
      console.error('<audio>', e)
    }

    this.onEnd = function () {
      this.opts.onend()
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

    this.init = function () {
      if (!audioTag) {
        audioTag = this.root.querySelectorAll('audio')[0]
        audioTag.addEventListener('timeupdate', this.onTime.bind(this))
        audioTag.addEventListener('ended', this.onEnd.bind(this))
        audioTag.addEventListener('emptied', this.onReset.bind(this))
        audioTag.addEventListener('error', this.onError.bind(this))
        return true
      }
    }

    this.store.on('restartSong', function () {
      audioTag.currentTime = 0
    })
    
    this.on('update', function () {
      var nitted = this.init()
      if (!nitted) this.handleChange()
    }.bind(this))
  </script>
</audio-player>