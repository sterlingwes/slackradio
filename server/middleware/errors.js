module.exports = function (err, req, res, next) {
  const message = err.message || err.reason
  console.error('Error!', message)
  res.status(500).json({ error: message })
}
