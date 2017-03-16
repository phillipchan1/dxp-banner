# DXP Background
Animating shapes mini-plugin. Example: 
https://dxp-banner-goehgnxvmf.now.sh/

#### 
```
shapeCreator.add(selector, opts)
```

## Simple Usage

```
shapeCreator.add(
    '#dxp-background2',
    {
        canvasWidth: '50%',
        canvasHeight: '100%',
        shape: 'square',
        movement: 'expand',
        num: 20,
        maxSpeed: 5,
        maxSize: 10,
        style: 'outline'
    }
);
```

## Selector
Use query selector syntax (e.g. `.container` or `#banner`);

## Options


**canvasWidth** [Number or String]

Specify width of canvas. Can be percentage `Number` (e.g. `500`) or pixel `String` (e.g. `'50%'`)

**canvasHeight** [Number or String]

Specify height of canvas. Can be percentage `Number` (e.g. `500`) or pixel `String` (e.g. `'50%'`)

**shape** [String]

Options: `square`, `circle`, `rectangle`

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

