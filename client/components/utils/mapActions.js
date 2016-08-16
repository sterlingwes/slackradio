var mappedActions = []

module.exports = function (actions, store) {
  Object.keys(actions).forEach(action => {
    var actionFn = actions[action]    
    store.on(action, function () {
      var actionVal = actionFn
      if (typeof actionFn === 'function') {
        actionVal = actionFn.apply(null, arguments)
      }

      store.dispatch(actionVal)
    })

    if (mappedActions.indexOf(action) !== -1) {
      console.warn('action naming conflict!', action)
    }
    mappedActions.push(action)
  })
}
