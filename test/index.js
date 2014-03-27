!function(root, name) {
  var emitted = 0
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
    aok.prototype.pass = 'ok'
    aok.prototype.fail = 'FAIL'
    aok.info(known)
    aok.info(enabled)
    aok.info(disabled)
  }
  
  aok('known keys', known.every(is.str))
  aok('enabled keys', enabled.every(is.str))
  aok('disabled keys', disabled.every(is.str))
  
  aok('enabled', is.arr(enabled))
  aok('disabled', is.arr(disabled))
  aok('known', is.arr(known))
  
  aok('known logical', known.length === enabled.length + disabled.length)
  aok('enabled logical', !enabled.some(ux.disabled))
  aok('disabled logical', !disabled.some(ux.enabled))

  var now = (new Date).getTime(), pos = 'enabled-' + now, neg = 'disabled-' + now, pos2 = pos + '2'
  
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
  
  ux.forget.once(pos2, function(v) {
    aok('.forget listener this', this === ux.forget)
    aok('.forget listener args', v == pos2)
    emitted++
  })
    
  ux.enable(pos)
  ux.disable(neg)
  aok('enable', ux.enabled(pos))
  aok('disable', ux.disabled(neg))
  aok('disable', ux.disabled(neg))
  ux.forget(pos2)
  
  if (2 < known.length) {
    ux.forget()
    aok('forget all', !ux.known().length)
  }
  
  setTimeout(function() {
    aok('emitted', emitted)
  }, 0)
}(this, 'ux');