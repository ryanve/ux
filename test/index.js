!function(root, name) {
  var emitted = 0
  var toggled = 0
  var is = {
    arr: Array.isArray || function(v) { return v instanceof Array },
    str: function(v) { return typeof v == 'string' },
    bool: function(v) { return typeof v == 'boolean' },
    yes: function(v) { return v === true },
    no: function(v) { return v === false }
  }

  var common = typeof module != 'undefined' && !!module.exports
  var aok = common ? require('aok') : root.aok
  var ux = common ? require('../src') : root[name]
  
  var known = ux.known()
  var enabled = ux.enabled()
  var disabled = ux.disabled()

  if (typeof location != 'undefined') {
    // abort subsequent tests in ie8-
    if (![].some) return void aok('exists', 'enable' in ux)
    
    // make fails more noticeable in the console
    aok.prototype.pass = 'ok'
    aok.prototype.fail = 'FAIL'
    
    // log the restored arrays
    aok.info(known)
    aok.info(enabled)
    aok.info(disabled)
  }
  
  aok('.known keys', known.every(is.str))
  aok('.enabled keys', enabled.every(is.str))
  aok('.disabled keys', disabled.every(is.str))
  
  aok('.enabled', is.arr(enabled))
  aok('.disabled', is.arr(disabled))
  aok('.known', is.arr(known))
  
  aok('.known logical', known.length === enabled.length + disabled.length)
  aok('.enabled logical', !enabled.some(ux.disabled))
  aok('.disabled logical', !disabled.some(ux.enabled))

  ;['forget', 'enable', 'disable'].forEach(function(method) {
    var invalids = [void 0, null, [], true]
    aok('.' + method + ' errors', !invalids.some(this, method))
  }, aok.can(function(v) {
    ux[this](v)
  }))

  var now = (new Date).getTime()
  var pos = 'enabled-' + now
  var neg = 'disabled-' + now
  var pos2 = pos + '2'

  ux.enable.once(pos, function(v) {
    aok('.enable listener this', this === ux.enable)
    aok('.enable listener args', v == pos)
    emitted++
  })
  
  ux.disable.once(pos, function(v) {
    aok('.disable listener this', this === ux.disable)
    aok('.disable listener args', v == pos)
    emitted++
  })
  
  ux.toggle.once(pos, function(v) {
    aok('.toggle listener this', this === ux.toggle)
    aok('.toggle listener args', v == pos)
    toggled++
  })
  
  ux.forget.once(pos2, function(v) {
    aok('.forget listener this', this === ux.forget)
    aok('.forget listener args', v == pos2)
    emitted++
  })
    
  ux.enable(pos)
  ux.disable(neg)
  aok('.enable', ux.enabled(pos))
  aok('.disable', ux.disabled(neg))
  aok('.disable', ux.disabled(neg))
  ux.forget(pos2)

  var beforeToggle = ux.enabled(pos)
  var toggledStates = ['enabled', 'disabled']
  beforeToggle && toggledStates.reverse()
  toggledStates.forEach(function(state, i) {
    ux.toggle(pos)
    aok('.toggle ' + i, ux[state](pos))
  })

  aok('.toggle after', ux.enabled(pos) === beforeToggle)
  aok('.toggle emit', toggled)
  
  if (2 < known.length) {
    ux.forget()
    aok('.forget all', !ux.known().length)
  }
  
  setTimeout(function() {
    aok('emitted', emitted)
  }, 0)
}(this, 'ux');