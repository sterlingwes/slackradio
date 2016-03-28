function logStart (action, store) {
  if ('groupCollapsed' in console) {
    console.groupCollapsed('%cACTION ' + String.fromCharCode(8649) + ' ' + action.type, 'font-weight: normal')
    console.log('%cOld state', 'color: #ccc', store.getState())
  }
}

function logEnd (action, store) {
  if ('groupEnd' in console) {
    console.log('%cPayload', 'color: #aaa', action)
    console.log('%cNew state', 'color: blue', store.getState())
    console.groupEnd()
  }
}

var ignore = []

function middleware (store) {
  return function (next) {
    return function (action) {
      if (ignore.indexOf(action.type) !== -1) return next(action)

      if (!/@@redux\//.test(action.type)) {
        logStart(action, store)
        var result = next(action)
        logEnd(action, store)
        return result
      }
      return next(action)
    }
  }
}

module.exports = function (options) {
  if (options && options.ignore) {
    ignore = options.ignore
  }

  return middleware
}

