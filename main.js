var generateNumBetween = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

var canvas = document.getElementById('dxp-background');
var ctx = canvas.getContext('2d');

var draw = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for (let p = 0; p < shapeCreator.sets.length; p++) {
		var currentSet = shapeCreator.sets[p];

		for (var i = 0; i < currentSet.shapes.length; i++) {
			currentSet.shapes[i].update();
		}
	}

	requestAnimationFrame(draw);
}

var Shape = function(opts) {
	var self = this;

	this.shape = opts.shape;
	this.speed = opts.speed;
	this.width = opts.width;
	this.xPos = opts.xPos;
	this.yPos = opts.yPos;
	this.opacity = 0.05 + Math.random() * 0.5;
	this.originalY = opts.yPos;

	var shapeAttributes = {
		circle: function() {
			ctx.arc(
				self.xPos,
				self.yPos,
				self.width,
				0,
				Math.PI * 2,
				false
			);
		},
		square: function() {
			ctx.rect(
				self.xPos, 
				self.yPos, 
				self.width, 
				self.width
			)
		}
	};

	this.drawShape = function(shape) {
		shapeAttributes[shape]();
	}

	
}

Shape.prototype.update = function() {
	ctx.beginPath();

	this.drawShape(this.shape);

	// move horizontally
	if (this.xPos < canvas.width + this.width) {
		this.xPos = this.xPos + (0.3 * this.speed);	
	} else {
		this.xPos = -this.width;
		this.yPos = this.originalY;
	}

	// move vertically
	if (this.yPos > (canvas.height / 2)) {
		this.yPos = this.yPos - 0.1;
	} else {
		this.yPos = this.yPos + 0.1;
	}

	ctx.closePath();

	// style
	ctx.fillStyle = 'rgba(185, 211, 238,' + this.opacity + ')';
	ctx.shadowColor = '#FFF';
	ctx.shadowBlur = 20;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;

	ctx.fill();
};

var shapeCreator = {
	numOfSets: 0,
	sets: [],
	add: function(opts) {
		var set = {};

		set.shapes = [];

		if (!opts.shape) return;

		for (var i = 0; i < opts.num; i++) {

			var minSpeed = opts.minSpeed || 1;
			var maxSpeed = opts.maxSpeed || 5;
			var startingX = opts.startingX || 5;

			var randomX = generateNumBetween(-200, canvas.width);
			var randomY = generateNumBetween(0, canvas.height);
			var speed = generateNumBetween(minSpeed, maxSpeed);
			var size = generateNumBetween(0, opts.maxSize);

			var shape = new Shape({
				shape: opts.shape,
				xPos: randomX,
				yPos: randomY,
				width: size,
				speed: speed
			})

			// var shape = new Shape(this.canvas, this.context, opts.shape, speed, size, randomX, randomY);

			set.shapes.push(shape);
		}

		this.sets.push(set)
		this.numOfSets++;

		draw();
		console.log(this);
	}
};

var init = function() {

	// var canvas = document.getElementById('dxp-background');
	// var ctx = canvas.getContext('2d');

	shapeCreator.add({
		shape: 'circle',
		num: 30,
		maxSpeed: 5,
		maxSize: 10
	});


	shapeCreator.add({
		// shape: 'square',
		num: 10,
		maxSpeed: 5,
		maxSize: 10
	});
};


init();
