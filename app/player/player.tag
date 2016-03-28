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

    <audio-player song={ state.song } onend={ onEnd }></audio-player>
  </div>
  
  <style>
    .trackdetails {
      margin: 20px 10px 10px 10px;
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
    var player

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
    
    this.onEnd = function () {
      this.store.trigger('nextSong')
    }.bind(this)

    this.store.on('songChanged', function () {
      this.play(true)
    }.bind(this))

    this.start = function () {
      player = this.tags['audio-player']  
      this.store.trigger('queueSong')
    }

    this.start()
  </script>
</player>