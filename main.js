var generateNumBetween = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

// var canvas = document.getElementById('dxp-background');
// var ctx = canvas.getContext('2d');

var draw = function() {
	
	
	for (let p = 0; p < shapeCreator.sets.length; p++) {
		var currentSet = shapeCreator.sets[p];

		currentSet.context.clearRect(0, 0, currentSet.canvas.width, currentSet.canvas.height);
		var currentSet = shapeCreator.sets[p];

		for (var i = 0; i < currentSet.shapes.length; i++) {
			currentSet.shapes[i].update();
		}
	}

	requestAnimationFrame(draw);
}

var Shape = function(opts) {
	var self = this;

	this.context = opts.context;
	this.canvas = opts.canvas;

	this.opacity = 0.05 + Math.random() * 0.5;
	this.originalY = opts.yPos;
	this.shape = opts.shape;
	this.size = opts.size;
	this.speed = opts.speed;
	this.xPos = opts.xPos;
	this.yPos = opts.yPos;

	var shapeAttributes = {
		circle: function() {
			self.context.arc(
				self.xPos,
				self.yPos,
				self.size,
				0,
				Math.PI * 2,
				false
			);
		},
		square: function() {
			self.context.rect(
				self.xPos, 
				self.yPos, 
				self.size, 
				self.size
			)
		}
	};

	this.drawShape = function(shape) {
		shapeAttributes[shape]();
	}

	this.update = function() {
		var ctx = self.context;

		ctx.beginPath();

		this.drawShape(this.shape);

		// move horizontally
		if (this.xPos < self.canvas.width + this.size) {
			this.xPos = this.xPos + (0.3 * this.speed);	
		} else {
			this.xPos = -this.size;
			this.yPos = this.originalY;
		}

		// move vertically
		if (this.yPos > (self.canvas.height / 2)) {
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
}

var shapeCreator = {
	numOfSets: 0,
	sets: [],
	add: function(opts) {
		var set = {};

		set.shapes = [];
		set.context = opts.context;
		set.canvas = opts.canvas;

		if (!opts.shape) return;

		for (var i = 0; i < opts.num; i++) {

			var minSpeed = opts.minSpeed || 1;
			var maxSpeed = opts.maxSpeed || 5;
			var startingX = opts.startingX || 5;

			var randomX = generateNumBetween(-200, opts.canvas.width);
			var randomY = generateNumBetween(0, opts.canvas.height);
			var speed = generateNumBetween(minSpeed, maxSpeed);
			var size = generateNumBetween(0, opts.maxSize);

			var shape = new Shape({
				canvas: opts.canvas,
				context: opts.context,
				shape: opts.shape,
				size: size,
				speed: speed,
				xPos: randomX,
				yPos: randomY
			})

			set.shapes.push(shape);
		}

		this.sets.push(set)
		this.numOfSets++;

		draw();
		console.log(this);
	}
};

var init = function() {

	var canvas = document.getElementById('dxp-background');
	var ctx = canvas.getContext('2d');

	shapeCreator.add({
		canvas: canvas,
		context: ctx,
		shape: 'circle',
		num: 30,
		maxSpeed: 5,
		maxSize: 10
	});

	var canvas = document.getElementById('dxp-background2');
	var ctx = canvas.getContext('2d');

	shapeCreator.add({
		canvas: canvas,
		context: ctx,
		shape: 'square',
		num: 10,
		maxSpeed: 5,
		maxSize: 10
	});
};


init();
