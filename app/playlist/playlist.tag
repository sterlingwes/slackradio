<playlist>
  
  <div class="tracklist">
    <div each={ song, i in state.songs } 
      class={ track: 1, active: state.activeIndex === i }
      onclick={ pickSong }
      >
        <div class="thumb" style={ getBgImage(song.getThumb()) }></div>
        <div class="trackCount" style={ getTrackCountStyle(song.id) }></div>
        <div class="title">{ song.getArtist() } - { song.getTitle() }</div>
        <div class="time">{ song.getTime() }</div>
    </div>
  </div>
  
  <div class="trackadd">
    <input type="text" id="songUrl"
      onchange={ addSong }
      disabled={ state.processingSong }
      placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxxxx" />
  </div>

  <div if={ state.processingSong } class="spinner">
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
  </div>
  
  <style>
    playlist {
      display: inline-block;
      background: #171717;
      color: #aaa;
      font-family: 'LatoWebLight';
      font-size: 0.9em;
      box-shadow: inset 2px 2px 10px #111;
    }
    
    playlist, playlist .tracklist {
      position: absolute;
      top: 0; bottom: 0; right: 0;
      left: 300px;
    }
    
    playlist .tracklist {
      overflow: auto;
      left: 0;
      padding-bottom: 45px;
    }
    
    playlist .trackadd {
      position: absolute;
      bottom: 0; left: 0; right: 0;
    }
    
    playlist .trackadd input {
      width: 100%;
      padding: 10px;
      background: #000;
      outline: none;
      color: #fff;
      font-family: 'LatoWebLight';
      font-size: 1em;
      border: 0
    }
    
    playlist .trackadd input:disabled {
      background: #171717;
      color: #aaa;
    }
    
    ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
      color: #444;
    }
    
    playlist .spinner {
      position: absolute;
      right: 0; bottom: -95px
    }
    
    playlist .thumb {
      display: inline-block;
    }

    playlist .track .title {
      position: absolute;
      top: 7px;
      left: 55px;
      right: 50px;
      bottom: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    
    playlist .track .trackCount {
      position: absolute;
      top: 0;
      left: 40px;
      bottom: 0%;
      background: #1D1D1D
    }
    
    playlist .track {
      position: relative;
      border-bottom: 1px solid #222;
      cursor: pointer
    }
    
    playlist .track.active {
      color: #fff
    }
    
    playlist .thumb {
      width: 40px;
      height: 30px;
      margin-right: 10px
    }
    
    playlist .thumb img {
      max-width: 100%;
      height: auto
    }
    
    playlist .time {
      position: absolute;
      font-size: 0.9em;
      top: 8px;
      right: 10px;
    }
  </style>

  <script>
    var yturl = require('youtube-url')
  
    this.mixin('redux')
    this.use({
      songs: 'songs.playlist',
      activeIndex: 'songs.activeIndex',
      processingSong: 'songs.processingSong',
      playCounts: 'stats.songCounts',
      playCount: 'stats.totalCount'
    })
    
    this.getBgImage = function (img) {
      return [
        'background-image: url(' + img + ')',
        'background-size: cover',
        'background-position: center'
      ].join(';')
    }

    this.getTrackCountStyle = function (id) {
      var plays = this.state.playCounts[id] || 0
      if (!plays) return 'right: 100%'
      var pct = plays / this.state.playCount
      var right = 100 - Math.ceil(pct * 100)
      return 'right:' + right + '%'
    }
    
    this.pickSong = function (e) {
      this.store.trigger('songPicked', e.item.i)
    }
    
    this.addSong = function (e) {
      var url = e.target.value
      if (!yturl.valid(url)) return
      this.store.trigger('addingSong')
      window.SlackRadio.add(url)
    }

    this.store.on('processedSong', () => {
      document.getElementById('songUrl').value = ''
    })
  </script>
</playlist>