<pie>

  <svg viewbox={ circle.viewbox }>
    <circle
      r={ circle.r } cx={ circle.cx } cy={ circle.cy }
      style={ circle.style } />
  </svg>

  <style>
    svg {
      transform: rotate(-228deg);
      border-radius: 50%;
    }
  </style>

  <script>
    var makeStyle = require('../utils/makeStyle.js')

    this.mixin('redux')
    this.use({
      percent: 'songs.playing.elapsed'
    })
    
    var maxPct = 78 / 100
    var fill = this.opts.fill || 'lightblue'
    var bgfill = this.opts.bgfill || '#655'

    this.circle = {}
    
    this.getPct = function () {
      return (this.state.percent || 0) * maxPct
    }
  
    this.draw = function () {
      this.circle = calc(this.getPct(), this.size / 2, fill, bgfill)
    }
    
    this.size = parseInt(this.opts.size || 100, 10)

    this.draw()

    function calc (percent, radius, fill, bgfill) {
      var diameter = radius * 2
      return {
        viewbox: '0 0 ' + diameter + ' ' + diameter,
        r: radius,
        cx: radius,
        cy: radius,
        style: makeStyle({
          'stroke-dasharray': strokeArray(percent, circumference(radius)),
          'stroke-width': radius * 2,
          'fill': bgfill,
          'stroke': fill
        })
      }
    }
 
    var PIE = 3.14159
 
    function getRadius (size) {
      return size / 2 * PIE
    }

    function strokeArray (percent, circumference) {
      if (!percent || !circumference) return ''
      var array = (percent / 100) * circumference + ' ' + circumference
      return array
    }

    function circumference (radius) {
      return 2 * PIE * radius
    }
    
    this.on('update', this.draw.bind(this))
  </script>
</pie>