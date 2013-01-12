
# cuboid

  Cuboid component.

## Installation

    $ component install mnmly/cuboid

## API

### Cuboid( width, height, depth )

Create a new `Cuboid`:

```javascript

var Cuboid = require( 'cuboid' );
var cuboid = new Cuboid( 100, 200, 300 );
var cuboid = Cuboid( 100, 200, 300 );

```

### Cuboid#update( width, height, depth )

Updates the cuboid

```javascript

cuboid.update( 200, 300, 100 );

```

## Example
  
      var Cuboid  = require( 'cuboid' ),
          count   = 0;
          world   = document.querySelector( '.world' );

      // `world` should have `prespective` property.
      cuboid = new Cuboid( 100, 200, 300 );
      world.appendChild( cuboid.el );


## License

  MIT
