<player>
  
  <div if={ state.song }>
    <track-circle></track-circle>

    <div class="trackdetails">
      <div class="trackname">{ state.song.getTitle() }</div>
      <div class="trackartist">{ state.song.getArtist() }</div>
    </div>

    <div class="controls">
      <div class={ control: 1, play: 1, playing: state.isPlaying } onclick={ play }></div>
    </div>

  </div>
  
  <style>
    .trackdetails {
      margin: 25px 20px;
      margin-bottom: 10px;
      text-align: center
    }
    
    .trackdetails .trackname {
      margin-bottom: 5px
    }
 
    .trackdetails .trackartist {
      font-family: 'LatoWebLight'
    }
  </style>

  <script>
    var audio = require('./audio')

    this.mixin('redux')
    this.use({
      songs: 'songs.playlist',
      song: 'songs.playing',
      isPlaying: 'songs.isPlaying'
    })
    
    this.play = function (force) {
      if (force !== true && this.state.isPlaying) {
        return this.stop()
      }
      this.store.trigger('play')
    }
    
    this.stop = function () {
      this.store.trigger('pause')
    }

    this.store.on('songChanged', function () {
      this.play(true)
    }.bind(this))

    this.start = function () {
      this.store.trigger('queueSong')
    }

    this.start()

    this.on('mount', function () {
      audio(this.store)
    }.bind(this))

    this.on('update', function () {})
  </script>
</player>