const del = require('del')

module.exports = function (store, cb) {
  del('media/*')
    .then(function () { cb() })
    .catch(cb)
}
