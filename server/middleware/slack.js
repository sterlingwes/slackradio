const slack = require('slack')
const config = require('config')
const _ = require('lodash')

const slackId = config.get('slack.id')
const slackSecret = config.get('slack.secret')

exports.authorize = function (req, res, next) {
  slack.oauth.access({
    client_id: slackId,
    client_secret: slackSecret,
    code: req.body.code
  }, (err, response) => {
    if (err) return next(err)
    slack.auth.test({ token: response.access_token }, (err, test) => {
      if (err) return next(err)
      req.slackUser = _.extend(response, test)
      next()
    })
  })
}
