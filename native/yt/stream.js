var request = require('request')
var streamify = require('streamify')
var url = require('url')
var http = require('http')

function getStream (data, stream, options) {
  var item = (!data.length) ? data : data.shift()

  var headers = {
    'Host': url.parse(item.url).hostname
  }

  if (options && options.start > 0) {
    headers.Range = 'bytes=' + options.start + '-'
  }

  var req = request({
    url: item.url,
    headers: headers
  })

  req.on('response', function response (res) {
    var size = parseInt(res.headers['content-length'], 10)
    if (size) {
      item.size = size
    }

    if (options && options.start > 0 && res.statusCode === 416) {
      // the file that is being resumed is complete.
      return stream.emit('complete', item)
    }

    if (res.statusCode !== 200 && res.statusCode !== 206) {
      return stream.emit('error', new Error('status code ' + res.statusCode))
    }

    stream.emit('info', item)

    stream.on('end', function end () {
      if (data.length) { stream.emit('next', data) }
    })
  })

  stream.resolve(req)
}

module.exports = function (json) {
  var stream = streamify({
    superCtor: http.ClientResponse,
    readable: true,
    writable: false
  })

  if (typeof videoUrl !== 'string') {
    getStream(json, stream)
    return stream
  }
}
