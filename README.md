# ux
#### website user preference API
<b>ux</b> uses `localStorage` to remember features such as user preferences or display modes.

## API

#### Methods

- [<b>ux.enabled</b>(feature?)](#enabled)
- [<b>ux.disabled</b>(feature?)](#disabled)
- [<b>ux.known</b>(feature?)](#known)
- <a name="emitters-group"></a>[<b>Emitters</b>](#emitters)
  - [<b>ux.enable</b>(feature)](#enable)
  - [<b>ux.disable</b>(feature)](#disable)
  - [<b>ux.toggle</b>(feature)](#toggle)
  - [<b>ux.forget</b>(feature?)](#forget)

#### Notes

- <var>feature</var> can be any string
- features are either *enabled*, *disabled*, or *unknown*

<a name="enabled"></a>
####`ux.enabled()`
- Get an array containing the names of all enabled features
- <b>@return</b> array

####`ux.enabled(feature)`
- Test if <var>feature</var> is enabled
- <b>@return</b> boolean

<a name="disabled"></a>
####`ux.disabled()`
- Get an array containing the names of all disabled features
- <b>@return</b> array

####`ux.disabled(feature)`
- Test if <var>feature</var> is disabled
- <b>@return</b> boolean

<a name="known"></a>
####`ux.known()`
- Get an array containing the names of all known features
- <b>@return</b> array

####`ux.known(feature)`
- Test if <var>feature</var> is known (either enabled or disabled)
- <b>@return</b> boolean

<a name="enable"></a>
#### `ux.enable(feature)`
- Enable a feature and trigger listeners

<a name="disable"></a>
#### `ux.disable(feature)`
- Disable a feature and trigger listeners

<a name="toggle"></a>
#### `ux.toggle(feature)`
- Toggle (either enable or disable) a feature and trigger listeners

<a name="forget"></a>
#### `ux.forget(feature)`
- Forget feature and trigger listeners

#### `ux.forget()`
- Forget *all* features

<a name="emitters"></a>
### [Emitters](#emitters-group) have [emitter methods](https://github.com/ryanve/energy/tree/0.4.0#methods)

 - `.on(feature, listener)`
 - `.off(feature?, listener?)`
 - `.once(feature, listener)`
 - `.emit(feature, ...args)`
 
#### Emitter syntax
 
 - `ux.enable.on(feature, listener)`
 - `ux.disable.on(feature, listener)`
 - `ux.forget.on(feature, listener)`
 - `ux.enable.off(feature?, listener?)`
 - `ux.disable.off(feature?, listener?)`
 - `ux.forget.off(feature?, listener?)`
 - etc.

#### Emitter example
```js
// Listen for when 'crazycolors' is enabled
ux.enable.on('crazycolors', function(feature) {
  document.querySelector('html').classList.add(feature)
  console.log(feature + ' enabled')
})

// Enable 'crazycolors'
ux.enable('crazycolors')
```

You normally would want to also listen for when the same feature is disabled and do an opposing action. You're also likely to have multiple (and maybe related) features. `ux` doesn't care what your features do. It only provides the API for enabling, disabling, and remembering them. Do what makes sense for your features and users :)

## Contribute
To make edits, first [fork the repo](https://help.github.com/articles/fork-a-repo), clone your fork, and `cd` into it. Run [tests](test) via the commands below and/or in a [browser](test/index.html). Make edits in [src](src) and [test](test) as needed. Push your changes and then submit a [pull request](https://help.github.com/articles/using-pull-requests). Builds (in the [project root](../../)) are created later via `grunt` and should not be changed in pull requests. CLI commands require [node](http://nodejs.org) and the [grunt-cli](http://gruntjs.com/getting-started) on your system.

<a name="cli"></a>
```sh
$ npm install -g grunt-cli # install grunt-cli if you haven't already
$ npm install # install devDependencies from package.json
$ grunt jshint:sub # lint sub dirs
$ grunt test # run tests
```

## Fund
Support this project by [tipping the developer](https://www.gittip.com/ryanve/) <samp><b>=)</b></samp>

## License
MIT