<track-circle>
  <pie class="track" style={ pieStyle } fill="lightblue"></pie>
  <div class="album" style={ albumStyle }>
    <div class="space" style={ spaceStyle }></div>
    <div class="cutout"></div>
  </div>
  <div class="cover" style={ coverStyle }>
    <div class="coverimg" style={ imgStyle }></div>
  </div>

  <script>
    var makeStyle = require('../utils/makeStyle.js')
    var extendStyle = require('../utils/extendStyle.js')

    this.mixin('redux')
    this.use({
      song: 'songs.playing',
      isPlaying: 'songs.isPlaying'
    })

    var albumWidth = 210
    var trackSize = 4
    var innerOffset = 0
    var coverAnim = 'album-spin 3s 0.15s ease-in, album-spin 1.8s 3.15s infinite linear'

    this.spin = function () {
      this.coverStyle = extendStyle(this.coverStyle, {
        animation: coverAnim
      })
    }

    this.stop = function () {
      this.coverStyle = extendStyle(this.coverStyle, {
        animation: ''
      })
    }

    this.render = function () {
      this.albumStyle = makeStyle({
        top: (innerOffset + trackSize) + 'px'
      })

      this.pieStyle = makeStyle({
        width: albumWidth + 'px'
      })

      var innerWidth = albumWidth - trackSize * 2
      this.spaceStyle = makeStyle({
        width: innerWidth + 'px',
        height: innerWidth + 'px'
      })

      var coverWidth = innerWidth - trackSize * 6
      this.coverStyle = makeStyle({
        top: (innerOffset + trackSize * 4) + 'px',
        height: coverWidth + 'px'
      })

      this.imgStyle = makeStyle({
        width: coverWidth + 'px',
        height: coverWidth + 'px',
        'background-image': 'url(' + this.state.song.getThumb() + ')'
      })

      if (this.state.isPlaying) {
        this.spin()
      } else {
        this.stop()
      }
    }
    
    this.on('update', function () {
      if (this.state.song) {
        this.render()
      }
    })
  </script>
</track-circle>