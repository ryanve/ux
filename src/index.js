!function(root, name, make) {
  if (typeof module != 'undefined' && module.exports) module.exports = make(require)
  else root[name] = make(function(id) { return root[id] })
}(this, 'ux', function(require) {

  var cache
    , cargo = require('cargo')
    , energy = require('energy')
    , namespace = 'ux@0.0'
    , loc = typeof location != 'undefined' && location
    , storage = cargo[loc.hostname ? 'local' : 'session']
    , stores = storage.stores !== false
    , get = stores ? function() {
        var o = storage.get(namespace)
        return o && typeof(o = decode(o)) == 'object' && o || {}
      } : function() {
        return cache || {}
      }
    , set = stores ? function(updated) {
        if (typeof updated != 'object') throw new TypeError
        if (!updated) storage.remove(namespace)
        else storage.set(namespace, encode(updated))
      } : function(updated) {
        if (typeof updated == 'object') cache = updated
      }
    , keys = Object.keys
    , filter = keys ? function(o, fn, scope) {
        return keys(o).filter(fn, scope)
      } : function() {
        return []
      }
  
  /**
   * @param {string|number} key
   * @return {string}
   */
  function normalize(key) {
    if (typeof key == 'string') return key
    if (typeof key == 'number') return '' + key
    throw new TypeError
  }
  
  /**
   * @param {Object|string} data
   * @return {string}
   */
  function encode(data) {
    if (typeof data == 'string') return data
    return storage.encode(null == data ? {} : data)
  }
  
  /**
   * @param {string|null} data
   * @return {Object}
   */
  function decode(data) {
    if (null == data) return {}
    return storage.decode(data)
  }
  
  /**
   * @param {boolean} value
   * @return {Function}
   */
  function getter(value) {
    /**
     * @param {string=} feature
     * @return {boolean|Array}
     */
    return function(feature) {
      var o = get()
      return !arguments.length ? filter(o, function(k) {
        return o[k] === value
      }) : o[normalize(feature)] === value
    }
  }
  
  /**
   * @param {boolean} value
   * @return {Function}
   */
  function setter(value) {
    /**
     * @param {string} feature
     */
    function f(feature) {
      var o = get(), same = o[feature = normalize(feature)] === value
      o[feature] = value
      same || set(o)
      f.emit(feature, feature)
    }
    return f
  }
  
  /**
   * @param {string=} feature
   * @return {boolean|Array}
   */
  function known(feature) {
    var o = get()
    return !arguments.length ? filter(o, function(k) {
      return typeof o[k] == 'boolean'
    }) : typeof o[normalize(feature)] == 'boolean'
  }
  
  /**
   * @param {string=} feature
   */
  function forget(feature) {
    if (!arguments.length) return void set(null)
    var o = get()
    if (delete o[feature = normalize(feature)]) set(o)
    else throw new Error
    forget.emit(feature, feature)
  }

  return {
    // convert the setters into emitters
    'enable': energy.to(setter(true)),
    'disable': energy.to(setter(false)),
    'forget': energy.to(forget),
    'enabled': getter(true),
    'disabled': getter(false),
    'known': known
  }
});