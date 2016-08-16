module.exports = function makeStyle (styleObj) {
  var styleStr = ''
  Object.keys(styleObj).forEach(function (key) {
    if (!styleObj[key]) return
    styleStr += key + ':' + styleObj[key] + ';'
  })
  return styleStr
}
