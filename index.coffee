domify    = require( 'domify' )
prefixed  = require( 'prefixed' )
transform = prefixed( 'transform' )

faces     = [ 'front', 'back',
              'right', 'left',
              'top',   'bottom' ]

class Cuboid

  constructor: ( @width = 100, @height = 100, @depth = 100 )->

    unless @ instanceof Cuboid then return new Cuboid( @width, @height, @depth )

    @el = domify( '<div class="cuboid"/>')[0]
    @update( @width, @height, @depth )

  update: ( @width, @height, @depth )->

    faces.forEach ( face, i )=>
      faceEl = @[face]
      
      unless faceEl
        faceEl = @[face] = domify( "<div class='face #{face}'></div>" )[0]
        @el.appendChild( faceEl )
      
      style = faceEl.style

      switch face
        when 'front'
          style.width      = @width + 'px'
          style.height     = @height + 'px'
          style[transform] = "rotateY( 0deg )
                              translateX( #{ -@width / 2 }px )
                              translateY( #{ -@height / 2 }px )
                              translateZ( #{ @depth / 2 }px )"
        when 'back'
          style.width      = @width + 'px'
          style.height     = @height + 'px'
          style[transform] = "rotateY( 180deg )
                              translateX( #{@width / 2}px )
                              translateY( #{-@height / 2}px )
                              translateZ( #{@depth / 2}px )"

        when 'right'
          style.width      = @depth + 'px'
          style.height     = @height + 'px'
          style[transform] = "translateX( #{ -( @depth - @width ) / 2 }px )
                              translateY( #{ -@height / 2 }px )
                              rotateY( 90deg )"
        
        when 'left'
          style.width      = @depth + 'px'
          style.height     = @height + 'px'
          style[transform] = "translateX( #{ -( @depth + @width ) / 2 }px )
                              translateY( #{ -@height / 2 }px )
                              rotateY( -90deg )"
        
        when 'top'
          style.width      = @width + 'px'
          style.height     = @depth + 'px'
          style[transform] = "translateY(#{-@height / 2 - @depth / 2}px)
                              translateX(#{-@width / 2}px)
                              rotateX(90deg)"
        
        when 'bottom'
          style.width      = @width + 'px'
          style.height     = @depth + 'px'
          style[transform] = "translateY(#{@height / 2 - @depth / 2}px)
                              translateX(#{-@width / 2}px)
                              rotateX(-90deg)"

module.exports = Cuboid
