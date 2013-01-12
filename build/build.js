

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-domify/index.js", Function("exports, require, module",
"\n/**\n * Expose `parse`.\n */\n\nmodule.exports = parse;\n\n/**\n * Wrap map from jquery.\n */\n\nvar map = {\n  option: [1, '<select multiple=\"multiple\">', '</select>'],\n  optgroup: [1, '<select multiple=\"multiple\">', '</select>'],\n  legend: [1, '<fieldset>', '</fieldset>'],\n  thead: [1, '<table>', '</table>'],\n  tbody: [1, '<table>', '</table>'],\n  tfoot: [1, '<table>', '</table>'],\n  colgroup: [1, '<table>', '</table>'],\n  caption: [1, '<table>', '</table>'],\n  tr: [2, '<table><tbody>', '</tbody></table>'],\n  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],\n  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],\n  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],\n  _default: [0, '', '']\n};\n\n/**\n * Parse `html` and return the children.\n *\n * @param {String} html\n * @return {Array}\n * @api private\n */\n\nfunction parse(html) {\n  if ('string' != typeof html) throw new TypeError('String expected');\n  \n  // tag name\n  var m = /<([\\w:]+)/.exec(html);\n  if (!m) throw new Error('No elements were generated.');\n  var tag = m[1];\n  \n  // body support\n  if (tag == 'body') {\n    var el = document.createElement('html');\n    el.innerHTML = html;\n    return [el.removeChild(el.lastChild)];\n  }\n  \n  // wrap map\n  var wrap = map[tag] || map._default;\n  var depth = wrap[0];\n  var prefix = wrap[1];\n  var suffix = wrap[2];\n  var el = document.createElement('div');\n  el.innerHTML = prefix + html + suffix;\n  while (depth--) el = el.lastChild;\n\n  return orphan(el.children);\n}\n\n/**\n * Orphan `els` and return an array.\n *\n * @param {NodeList} els\n * @return {Array}\n * @api private\n */\n\nfunction orphan(els) {\n  var ret = [];\n\n  while (els.length) {\n    ret.push(els[0].parentNode.removeChild(els[0]));\n  }\n\n  return ret;\n}\n//@ sourceURL=component-domify/index.js"
));
require.register("mnmly-prefixed/index.js", Function("exports, require, module",
"// Direct port from `Modernizr.prefixed`\n\n/**\n * Create our \"modernizr\" element that we do most feature tests on.\n */\nvar mod = 'modernizr',\n    modElem = document.createElement(mod),\n    mStyle = modElem.style,\n\n    // TODO :: make the prefixes more granular\n    /*>>prefixes*/\n    // List of property values to set for css tests. See ticket #21\n    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),\n    /*>>prefixes*/\n\n    /*>>domprefixes*/\n    // Following spec is to expose vendor-specific style properties as:\n    //   elem.style.WebkitBorderRadius\n    // and the following would be incorrect:\n    //   elem.style.webkitBorderRadius\n\n    // Webkit ghosts their properties in lowercase but Opera & Moz do not.\n    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+\n    //   erik.eae.net/archives/2008/03/10/21.48.10/\n\n    // More here: github.com/Modernizr/Modernizr/issues/issue/21\n    omPrefixes = 'Webkit Moz O ms',\n\n    cssomPrefixes = omPrefixes.split(' '),\n\n    domPrefixes = omPrefixes.toLowerCase().split(' ');\n    /*>>domprefixes*/\n    \n/**\n * is returns a boolean for if typeof obj is exactly type.\n */\nfunction is( obj, type ) {\n    return typeof obj === type;\n}\n\n/**\n * contains returns a boolean for if substr is found within str.\n */\nfunction contains( str, substr ) {\n    return !!~('' + str).indexOf(substr);\n}\n\nfunction testProps( props, prefixed ) {\n    for ( var i in props ) {\n        var prop = props[i];\n        if ( !contains(prop, \"-\") && mStyle[prop] !== undefined ) {\n            return prefixed == 'pfx' ? prop : true;\n        }\n    }\n    return false;\n}\n/*>>testprop*/\n\n// TODO :: add testDOMProps\n/**\n * testDOMProps is a generic DOM property test; if a browser supports\n *   a certain property, it won't return undefined for it.\n */\nfunction testDOMProps( props, obj, elem ) {\n    for ( var i in props ) {\n        var item = obj[props[i]];\n        if ( item !== undefined) {\n\n            // return the property name as a string\n            if (elem === false) return props[i];\n\n            // let's bind a function (and it has a bind method -- certain native objects that report that they are a\n            // function don't [such as webkitAudioContext])\n            if (is(item, 'function') && 'bind' in item){\n              // default to autobind unless override\n              return item.bind(elem || obj);\n            }\n\n            // return the unbound function or obj or value\n            return item;\n        }\n    }\n    return false;\n}\n\n/*>>testallprops*/\n/**\n * testPropsAll tests a list of DOM properties we want to check against.\n *   We specify literally ALL possible (known and/or likely) properties on\n *   the element including the non-vendor prefixed one, for forward-\n *   compatibility.\n */\nfunction testPropsAll( prop, prefixed, elem ) {\n\n    var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),\n        props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');\n\n    // did they call .prefixed('boxSizing') or are we just testing a prop?\n    if(is(prefixed, \"string\") || is(prefixed, \"undefined\")) {\n      return testProps(props, prefixed);\n\n    // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])\n    } else {\n      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');\n      return testDOMProps(props, prefixed, elem);\n    }\n}\n/*>>testallprops*/\n\nfunction prefixed(prop, obj, elem){\n  if(!obj) {\n    return testPropsAll(prop, 'pfx');\n  } else {\n    // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'\n    return testPropsAll(prop, obj, elem);\n  }\n};\n\n/*\nfunction cssPrefixed( prop, obj, elem ){\n    // If `prop` is hypenated, convert it to camelCase.\n    prop = prop.replace( /\\-(\\w)/g, function( a ){ return a.replace(/\\-/, '').toUpperCase() } ),\n    var str = prefixed( prop, obj, elem );\n    if ( str ) return str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');\n    return false;\n}*/\n\n\n/*\n * Expose `prefixed`\n **/\n\nmodule.exports = prefixed;\n//@ sourceURL=mnmly-prefixed/index.js"
));
require.register("cuboid/index.js", Function("exports, require, module",
"// Generated by CoffeeScript 1.4.0\nvar Cuboid, domify, faces, prefixed, transform;\n\ndomify = require('domify');\n\nprefixed = require('prefixed');\n\ntransform = prefixed('transform');\n\nfaces = ['front', 'back', 'right', 'left', 'top', 'bottom'];\n\nCuboid = (function() {\n\n  function Cuboid(width, height, depth) {\n    this.width = width != null ? width : 100;\n    this.height = height != null ? height : 100;\n    this.depth = depth != null ? depth : 100;\n    if (!(this instanceof Cuboid)) {\n      return new Cuboid(this.width, this.height, this.depth);\n    }\n    this.el = domify('<div class=\"cuboid\"/>')[0];\n    this.update(this.width, this.height, this.depth);\n  }\n\n  Cuboid.prototype.update = function(width, height, depth) {\n    var _this = this;\n    this.width = width;\n    this.height = height;\n    this.depth = depth;\n    return faces.forEach(function(face, i) {\n      var faceEl, style;\n      faceEl = _this[face];\n      if (!faceEl) {\n        faceEl = _this[face] = domify(\"<div class='face \" + face + \"'></div>\")[0];\n        _this.el.appendChild(faceEl);\n      }\n      style = faceEl.style;\n      switch (face) {\n        case 'front':\n          style.width = _this.width + 'px';\n          style.height = _this.height + 'px';\n          return style[transform] = \"rotateY( 0deg )                              translateX( \" + (-_this.width / 2) + \"px )                              translateY( \" + (-_this.height / 2) + \"px )                              translateZ( \" + (_this.depth / 2) + \"px )\";\n        case 'back':\n          style.width = _this.width + 'px';\n          style.height = _this.height + 'px';\n          return style[transform] = \"rotateY( 180deg )                              translateX( \" + (_this.width / 2) + \"px )                              translateY( \" + (-_this.height / 2) + \"px )                              translateZ( \" + (_this.depth / 2) + \"px )\";\n        case 'right':\n          style.width = _this.depth + 'px';\n          style.height = _this.height + 'px';\n          return style[transform] = \"translateX( \" + (-(_this.depth - _this.width) / 2) + \"px )                              translateY( \" + (-_this.height / 2) + \"px )                              rotateY( 90deg )\";\n        case 'left':\n          style.width = _this.depth + 'px';\n          style.height = _this.height + 'px';\n          return style[transform] = \"translateX( \" + (-(_this.depth + _this.width) / 2) + \"px )                              translateY( \" + (-_this.height / 2) + \"px )                              rotateY( -90deg )\";\n        case 'top':\n          style.width = _this.width + 'px';\n          style.height = _this.depth + 'px';\n          return style[transform] = \"translateY(\" + (-_this.height / 2 - _this.depth / 2) + \"px)                              translateX(\" + (-_this.width / 2) + \"px)                              rotateX(90deg)\";\n        case 'bottom':\n          style.width = _this.width + 'px';\n          style.height = _this.depth + 'px';\n          return style[transform] = \"translateY(\" + (_this.height / 2 - _this.depth / 2) + \"px)                              translateX(\" + (-_this.width / 2) + \"px)                              rotateX(-90deg)\";\n      }\n    });\n  };\n\n  return Cuboid;\n\n})();\n\nmodule.exports = Cuboid;\n//@ sourceURL=cuboid/index.js"
));
require.register("cuboid/template.js", Function("exports, require, module",
"module.exports = '';//@ sourceURL=cuboid/template.js"
));
require.alias("component-domify/index.js", "cuboid/deps/domify/index.js");

require.alias("mnmly-prefixed/index.js", "cuboid/deps/prefixed/index.js");

