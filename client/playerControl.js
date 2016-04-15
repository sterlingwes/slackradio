function PlayerControl (store) {
  this.store = store
}

PlayerControl.prototype.getState = function (reducer) {
  return this.store.getState()[reducer]
}

PlayerControl.prototype.isRadio = function () {
  return this.getState('app').mode === 'radio'
}

PlayerControl.prototype.getEventPrefix = function (opposite) {
  var prefix = this.isRadio() ? 'radio:' : ''
  if (opposite) prefix = prefix ? '' : 'radio:'
  return prefix
}

PlayerControl.prototype.getArgs = function (argObj, opposite) {
  var args = Array.prototype.slice.call(argObj, 0)
  var eventName = args.shift()
  args.unshift(this.getEventPrefix(opposite) + eventName)
  return args
}

PlayerControl.prototype.emit = function () {
  var args = this.getArgs(arguments)
  console.log('emit', args[0])
  return this.store.trigger.apply(this.store, args)
}

PlayerControl.prototype.emitOpposite = function () {
  var args = this.getArgs(arguments, true)
  console.log('emitOpp', args[0])
  return this.store.trigger.apply(this.store, args)
}

PlayerControl.prototype.play = function () {
  this.emitOpposite('pause')
  this.emit('playOrPause')
}

module.exports = PlayerControl
