// Generated by CoffeeScript 1.4.0
var Cuboid, domify, faces, prefixed, transform;

domify = require('domify');

prefixed = require('prefixed');

transform = prefixed('transform');

faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];

Cuboid = (function() {

  function Cuboid(width, height, depth) {
    this.width = width != null ? width : 100;
    this.height = height != null ? height : 100;
    this.depth = depth != null ? depth : 100;
    if (!(this instanceof Cuboid)) {
      return new Cuboid(this.width, this.height, this.depth);
    }
    this.el = domify('<div class="cuboid"/>')[0];
    this.update(this.width, this.height, this.depth);
  }

  Cuboid.prototype.update = function(width, height, depth) {
    var _this = this;
    this.width = width;
    this.height = height;
    this.depth = depth;
    return faces.forEach(function(face, i) {
      var faceEl, style;
      faceEl = _this[face];
      if (!faceEl) {
        faceEl = _this[face] = domify("<div class='face " + face + "'></div>")[0];
        _this.el.appendChild(faceEl);
      }
      style = faceEl.style;
      switch (face) {
        case 'front':
          style.width = _this.width + 'px';
          style.height = _this.height + 'px';
          return style[transform] = "rotateY( 0deg )                              translateX( " + (-_this.width / 2) + "px )                              translateY( " + (-_this.height / 2) + "px )                              translateZ( " + (_this.depth / 2) + "px )";
        case 'back':
          style.width = _this.width + 'px';
          style.height = _this.height + 'px';
          return style[transform] = "rotateY( 180deg )                              translateX( " + (_this.width / 2) + "px )                              translateY( " + (-_this.height / 2) + "px )                              translateZ( " + (_this.depth / 2) + "px )";
        case 'right':
          style.width = _this.depth + 'px';
          style.height = _this.height + 'px';
          return style[transform] = "translateX( " + (-(_this.depth - _this.width) / 2) + "px )                              translateY( " + (-_this.height / 2) + "px )                              rotateY( 90deg )";
        case 'left':
          style.width = _this.depth + 'px';
          style.height = _this.height + 'px';
          return style[transform] = "translateX( " + (-(_this.depth + _this.width) / 2) + "px )                              translateY( " + (-_this.height / 2) + "px )                              rotateY( -90deg )";
        case 'top':
          style.width = _this.width + 'px';
          style.height = _this.depth + 'px';
          return style[transform] = "translateY(" + (-_this.height / 2 - _this.depth / 2) + "px)                              translateX(" + (-_this.width / 2) + "px)                              rotateX(90deg)";
        case 'bottom':
          style.width = _this.width + 'px';
          style.height = _this.depth + 'px';
          return style[transform] = "translateY(" + (_this.height / 2 - _this.depth / 2) + "px)                              translateX(" + (-_this.width / 2) + "px)                              rotateX(-90deg)";
      }
    });
  };

  return Cuboid;

})();

module.exports = Cuboid;
