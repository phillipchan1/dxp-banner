var utils = (function() {
	return {
		generateNumBetween: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		isPercentage: function(string) {
			if (/^\d+(\.\d+)?%$/.test(string)) {
				let x = parseFloat(string);
				if (isNaN(x) || x < 0 || x > 100) {
				    return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		},
		parsePercentageOrPixel: function(figure) {
			// check if percentage
			if (/^\d+(\.\d+)?%$/.test(figure)) {
				return parseFloat(figure);
			} else {
				return figure;
			}
		},
		setCanvasSize: function(opts) {
			if (this.isPercentage(opts.size)) {
				let parentProperty = 'offset' + this.toTitleCase(opts.property);
				let parentPropertySize = opts.canvas.parentElement[parentProperty];

				opts.canvas[opts.property] = (parseFloat(opts.size) / 100) * parentPropertySize;

			} else {
				opts.canvas[opts.property] = opts.size;
			}
		},
		toTitleCase: function(str) {
    		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}
	};
})();

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
};

var Shape = function(opts) {
	var self = this;

	this.context = opts.context;
	this.canvas = opts.canvas;
	this.movement = opts.movement;
	this.opacity = 0.05 + Math.random() * 0.5;
	this.originalY;
	this.originalX;
	this.shape = opts.shape;
	this.size = opts.size;
	this.speed = opts.speed;
	this.style = opts.style;
	this.xPos = opts.xPos;
	this.yPos = opts.yPos;

	this.movements = {
		converge: {
			starting: function() {
				var xPos = utils.generateNumBetween(-200, opts.canvas.width);
				var yPos = utils.generateNumBetween(0, opts.canvas.height);

				self.originalY = yPos
				self.originalX = xPos
				self.xPos = xPos
				self.yPos = yPos;
			},
			move: function() {
				// move horizontally
				if (self.xPos < self.canvas.width + self.size) {
					self.xPos = self.xPos + (0.3 * self.speed);
				} else {
					self.xPos = -self.size;
					self.yPos = self.originalY;
				}

				// move vertically
				if (self.yPos > (self.canvas.height / 2)) {
					self.yPos = self.yPos - 0.1;
				} else {
					self.yPos = self.yPos + 0.1;
				}
			}
		},
		expand: {
			starting: function() {
				var xPos = utils.generateNumBetween(-200, opts.canvas.width / 2);
				var yPos = utils.generateNumBetween(
					// 40% from top
					(opts.canvas.height / 2) - (opts.canvas.height * .1),

					// 60% from top
					(opts.canvas.height / 2) + (opts.canvas.height * .1)
				);

				self.originalY = yPos;
				self.originalX = xPos;
				self.xPos = xPos;
				self.yPos = yPos;
			},
			move: function() {
				// move horizontally
				if (self.xPos < self.canvas.width + self.size) {
					self.xPos = self.xPos + (0.3 * self.speed);
				} else {
					self.xPos = -self.size;
					self.yPos = self.originalY;
				}

				// move vertically
				if (self.yPos > (self.canvas.height / 2)) {
					self.yPos = self.yPos + 0.2;
				} else {
					self.yPos = self.yPos - 0.2;
				}
			}
		}
	};

	this.move = function(movement) {
		this.movements[movement].move();
	};

	this.styles = {
		solid: function() {
			// style
			self.context.fillStyle = 'rgba(185, 211, 238,' + self.opacity + ')';
			self.context.fill();
		},
		outline: function() {
			self.context.strokeStyle = 'rgba(240, 241, 248,' + self.opacity + ')';
			self.context.stroke();
		}
	};

	this.setStyle = function() {
		this.styles[this.style]();
	};

	// set starting position
	this.movements[this.movement].starting();

	this.drawShape = function(shape) {
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
				);
			},
			rectangle: function() {
				self.context.rect(
					self.xPos,
					self.yPos,
					self.size * 2,
					self.size
				);
			}
		};
		shapeAttributes[shape]();
	};

	this.update = function() {
		var ctx = self.context;

		ctx.beginPath();

		// draw shape
		this.drawShape(this.shape);

		// define movement
		this.move(self.movement);

		// define style
		this.setStyle(self.style);

		ctx.closePath();

		ctx.shadowColor = '#FFF';
		ctx.shadowBlur = 20;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;


	};
};

var shapeCreator = {
	sets: [],
	add: function(selector, opts) {

		// create instance of canvas
		var instance = this.initCanvas(selector, opts);

		// check if canvas is unique
		var canvasUniqueness = this.checkSetUniqueness(instance.canvas);

		// to hold the shapes created
		var shapes = [];

		// create our shapes
		for (var i = 0; i < opts.num; i++) {
			var minSpeed = opts.minSpeed || 1;
			var maxSpeed = opts.maxSpeed || 5;
			var startingX = opts.startingX || 5;
			var speed = utils.generateNumBetween(minSpeed, maxSpeed);
			var size = utils.generateNumBetween(0, opts.maxSize);

			var shape = new Shape({
				canvas: instance.canvas,
				context: instance.context,
				movement: opts.movement,
				shape: opts.shape,
				style: opts.style,
				size: size,
				speed: speed
			});

			shapes.push(shape);
		}

		// if context already exists, add it to it
		if (canvasUniqueness !== true) {
			canvasUniqueness['shapes'] = canvasUniqueness['shapes'].concat(shapes);

		// otherwise create a new set
		} else {
			var set = {};

			set.shapes = shapes;
			set.context = instance.context;
			set.canvas = instance.canvas;

			this.sets.push(set);

			draw();
		}

	},

	// checks if a set is unique, if it is return true, otherwise return the set
	checkSetUniqueness: function(canvas) {
		var canvasUniqueness = true;

		for (var x = 0; x < this.sets.length; x++) {
			if (this.sets[x].canvas === canvas) {
				return this.sets[x];
			}
		}

		return canvasUniqueness;
	},

	// helps instatiates the canvas object
	initCanvas: function(selector, opts) {
		var canvas = document.querySelector(selector);
		var context = canvas.getContext('2d');
		var windowWidth = window.innerWidth;

		// set width
		if (opts.canvasWidth) {
			utils.setCanvasSize({
				canvas: canvas,
				property: 'width',
				size: opts.canvasWidth
			});
		}

		if (opts.canvasHeight) {
			utils.setCanvasSize({
				canvas: canvas,
				property: 'height',
				size: opts.canvasHeight
			});
		}




		return {
			canvas: canvas,
			context: context
		};
	}
};

var init = function() {

	// generate circles in first canvas
	shapeCreator.add(
		'#dxp-background',
		{
			canvasWidth: '50%',
			canvasHeight: '100%',
			movement: 'converge',
			shape: 'circle',
			num: 20,
			maxSpeed: 5,
			maxSize: 10,
			style: 'solid'
		}
	);

	// generate other shapes in second canvas
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

	shapeCreator.add(
		'#dxp-background2',
		{
			shape: 'circle',
			movement: 'expand',
			num: 30,
			maxSpeed: 5,
			maxSize: 10,
			style: 'outline'
		}
	);

	shapeCreator.add(
		'#dxp-background2',
		{
			shape: 'rectangle',
			movement: 'expand',
			num: 10,
			maxSpeed: 5,
			maxSize: 10,
			style: 'outline'
		}
	);
};


init();
