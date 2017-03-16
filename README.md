# DXP Background
Animating shapes mini-plugin. Example: 
https://dxp-banner-mmtjwqonxq.now.sh

#### 
```
shapeCreator.add(selector, opts)
```

## Simple Usage

**HTML**
```
<canvas id="dxp-background2"></canvas>
```

**Javascript**
```
shapesCreator.add(
    '#dxp-background2',
    {
        canvasWidth: '50%',
        canvasHeight: '100%',
        shape: 'square',
        movement: 'expand',
        num: 10,
        maxSpeed: 5,
        maxSize: 10,
        style: 'outline',
        transitionIn: 'fade',
        transitionOut: 'fade',
        transitionThreshold: 0.2
    }
);
```

## Selector
Use query selector syntax (e.g. `.container` or `#banner`) and select the canvas

## Options


##### canvasWidth [Number or String]

Specify width of canvas. Can be percentage `Number` (e.g. `500`) or pixel `String` (e.g. `'50%'`)

**canvasHeight** [Number or String]

Specify height of canvas. Can be percentage `Number` (e.g. `500`) or pixel `String` (e.g. `'50%'`)

**shape** [String]

Options: 
- `square` 
- `circle`
- `rectangle`
- `hexagon`

**movement** [String]
Specifies the type of movement the objects take on. 

Options:
- `expand`
- `converge`

**num** [Number]

Number of shapes to produce.

**maxSpeed** [Number]

Specifies max speed shapes move at

**maxSize** [Number]

Specifies maximum size of shapes

**transitionIn** [String]

Specifies what type of animation to transition in

Options:
- `fade`
 
**transitionOut** [String]

Options:
- `fade`

**transitionThreshold** [Integer]

Specifies what % of the canvas will it begin its transitions in and out. E.g. `0.2` signifies that the period of transition in is between 0-20% of the canvas width and the period of transition out is between the 80%-100% of canvas width.
