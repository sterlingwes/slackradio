const db = require('../db')

//
// save a playlist update ("sync")
//
exports.savePlaylist = function (playlist) {
  const userId = this.request.user.userId
  console.log(userId, playlist)
  db.users.update({ userId }, { $set: { playlist } }, (err, upd) => {
    if (err || !upd) {
      console.warn('? Unable to update user playlist', userId, err)
    }
  })
}
