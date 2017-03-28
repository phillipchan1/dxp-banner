var utils = (function() {
	return {
		// generate random number between 2 integers
		generateNumBetween: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},

		// checks if a value is a percentage
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

		// set the canvas size
		setCanvasSize: function(opts) {
			// if percentage
			if (this.isPercentage(opts.size)) {

				// if no parent is specified, find the element's parent
				let parentProperty = 'offset' + this.toTitleCase(opts.property);
				let parentPropertySize;

				if (opts.sizeParent) {
					if (opts.sizeParent === 'window') {
						parentPropertySize = window['inner' + this.toTitleCase(opts.property)];
					} else if (opts.sizeParent.length > 0) {
						parentPropertySize = document.querySelector(opts.sizeParent);
					}
				} else {
					parentPropertySize = opts.canvas.parentElement[parentProperty];
				}

				opts.canvas[opts.property] = (parseFloat(opts.size) / 100) * parentPropertySize;
			}

			// fixed pixel size
			else {
				opts.canvas[opts.property] = opts.size;
			}
		},

		// converts a string to Title Case
		toTitleCase: function(str) {
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}
	};
})();

var drawAnimation = function() {
	for (let p = 0; p < shapesCreator.sets.length; p++) {
		var currentSet = shapesCreator.sets[p];

		currentSet.context.clearRect(0, 0, currentSet.canvas.width, currentSet.canvas.height);

		for (var i = 0; i < currentSet.shapes.length; i++) {
			currentSet.shapes[i].update();
		}

		requestAnimationFrame(drawAnimation);
	}

};

var Shape = function(opts) {
	var self = this;

	this.context = opts.context;
	this.canvas = opts.canvas;
	this.movement = opts.movement;
	this.opacity = 0.05 + Math.random() * 0.5;
	this.originalY = undefined;
	this.originalX = undefined;
	this.shape = opts.shape;
	this.size = opts.size;
	this.speed = opts.speed;
	this.style = opts.style;
	this.transitionIn = opts.transitionIn;
	this.transitionOut = opts.transitionOut;
	this.transitionThreshold = 0.2 || opts.transitionThreshold;
	this.xPos = opts.xPos;
	this.yPos = opts.yPos;

	this.movements = {
		converge: {
			starting: function() {
				var xPos = utils.generateNumBetween(-200, opts.canvas.width);
				var yPos = utils.generateNumBetween(0, opts.canvas.height);

				self.originalY = yPos;
				self.originalX = xPos;
				self.xPos = xPos;
				self.yPos = yPos;
			},
			move: function() {
				// move horizontally
				if (self.xPos < self.canvas.width + self.size) {
					self.xPos = self.xPos + (0.1 * self.speed);
				} else {
					self.xPos = -self.size;
					self.yPos = self.originalY;
				}

				// move vertically
				if (self.yPos > (self.canvas.height / 2)) {
					self.yPos = self.yPos - 0.05;
				}
				else {
					self.yPos = self.yPos + 0.05;
				}
			}
		},
		expand: {
			starting: function() {
				var xPos = utils.generateNumBetween(-200, opts.canvas.width);
				var yPos = utils.generateNumBetween(
					// 40% from top
					(opts.canvas.height / 2) - (opts.canvas.height * .05),

					// 60% from top
					(opts.canvas.height / 2) + (opts.canvas.height * .05)
					);

				self.originalY = yPos;
				self.originalX = xPos;
				self.xPos = xPos;
				self.yPos = yPos;
			},
			move: function() {
				// move horizontally
				if (self.xPos < self.canvas.width + self.size) {
					self.xPos = self.xPos + (0.1 * self.speed);
				} else {
					self.xPos = -self.size;
					self.yPos = self.originalY;
				}

				// move vertically
				if (self.yPos > (self.canvas.height / 2)) {
					self.yPos = self.yPos + 0.05;
				} else {
					self.yPos = self.yPos - 0.05;
				}
			}
		}
	};

	this.move = function(movement) {
		this.movements[movement].move();
	};

	this.setStyle = function() {
		this.styles[this.style]();
	};

	this.styles = {
		solid: function() {
			// style
			self.context.fillStyle = 'rgba(185, 211, 238,' + self.opacity + ')';
			self.context.fill();
		},
		outline: function() {
			self.context.strokeStyle = 'rgba(240, 241, 248,' + self.opacity + ')';
			self.context.lineWidth = 3;
			self.context.stroke();
		}
	};

	this.transitions = {
		fade: {
			in: {
				init: function() {
					self.originalOpacity = self.opacity;
				},
				action: function(transitionInRange) {
					if (self.xPos <= 0) {
						self.opacity = 0;
					} else if (self.opacity < self.originalOpacity && self.xPos < transitionInRange[1]) {
						self.opacity = self.opacity + 0.001;
					}
				}
			},
			out: {
				init: function() {
					self.originalOpacity = self.opacity;
				},
				action: function(transitionOutRange) {
					if (self.xPos > transitionOutRange[0]) {
						self.opacity = self.opacity - .005;
					} else if (self.xPos > transitionOutRange[1]) {
						self.opacity = self.originalOpacity;
					}
				}
			}
		}
	};

	this.setTransition = function() {
		if (self.transitionIn) {
			this.transitions[self.transitionIn]['in']['init']();
		}

		if (self.transitionOut) {
			this.transitions[self.transitionOut]['out']['init']();
		}
	};

	this.transition = function() {
		var transitionInRange = [0, self.transitionThreshold * self.canvas.width];
		var transitionOutRange = [(1 - self.transitionThreshold) * self.canvas.width, self.canvas.width];

		if (self.transitionIn) {
			if (self.xPos / self.canvas.width < self.transitionThreshold) {
				this.transitions[self.transitionIn]['in']['action'](transitionInRange);
			}
		}

		if (self.transitionOut) {
			if (self.xPos / self.canvas.width > 0.8) {
				this.transitions[self.transitionOut]['out']['action'](transitionOutRange);
			}
		}
	};

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
			},
			hexagon: function() {
				self.context.moveTo(self.xPos, self.yPos);
				self.context.lineTo(self.xPos + self.size, self.yPos - (self.size / 2));
				self.context.lineTo(self.xPos + self.size, self.yPos - (self.size + (self.size / 2)));
				self.context.lineTo(self.xPos, self.yPos - (self.size * 2));
				self.context.lineTo(self.xPos - self.size, self.yPos - (self.size + (self.size/ 2)));
				self.context.lineTo(self.xPos - self.size, self.yPos - (self.size /2));
			}
		};

		self.context.beginPath();
		shapeAttributes[shape]();
		self.context.closePath();
	};

	// on every frame redraw, this is the function that controls what happens
	this.update = function() {
		var ctx = self.context;

		// draw shape
		this.drawShape(this.shape);

		// define movement
		this.move(self.movement);

		// transition
		this.transition();

		// define style
		this.setStyle(self.style);

		ctx.shadowColor = '#FFF';
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
	};

	// for everyshape, this init function gets called last to set properties
	this.init = (function() {
		// set starting position
		self.movements[self.movement].starting();

		// set transition inits
		self.setTransition();

	})();
};

var shapesCreator = {
	sets: [],
	add: function(selector, opts) {

		// create instance of canvas
		var instance = this.initCanvas(selector, opts);

		// check if canvas is unique
		var canvasUniqueness = this.checkSetUniqueness(instance.canvas);

		// array to hold the shapes created
		var shapes = [];

		// create our shapes and add to array
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
				speed: speed,
				transitionIn: opts.transitionIn,
				transitionOut: opts.transitionOut,
				transitionThreshold: 0.2
			});

			shapes.push(shape);
		}

		// if context already exists, add it to it
		if (canvasUniqueness !== true) {
			canvasUniqueness['shapes'] = canvasUniqueness['shapes'].concat(shapes);

		// otherwise create a new set and push it to master set
	} else {
		var set = {};

		set.shapes = shapes;
		set.context = instance.context;
		set.canvas = instance.canvas;
		set.canvasWidth = opts.canvasWidth;
		set.canvasHeight = opts.canvasHeight;

		this.sets.push(set);

		drawAnimation();
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
		console.log(canvas);
		// set width
		if (opts.canvasWidth) {
			utils.setCanvasSize({
				canvas: canvas,
				property: 'width',
				size: opts.canvasWidth
			});
		}

		// set height
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

// redraw on window resize
window.addEventListener('resize', function(e) {
	for (var p = 0; p < shapesCreator.sets.length; p++) {
		utils.setCanvasSize({
			canvas: shapesCreator.sets[p]['canvas'],
			property: 'width',
			size: shapesCreator.sets[p].canvasWidth
		});

		utils.setCanvasSize({
			canvas: shapesCreator.sets[p]['canvas'],
			property: 'height',
			size: shapesCreator.sets[p].canvasHeight
		});

		shapesCreator.sets[p].context.scale(1,1)
	};
});

var init = (function() {

	// generate circles in first canvas
	// shapesCreator.add(
	// 	'#dxp-background',
	// 	{
	// 		canvasWidth: '50%',
	// 		canvasHeight: '80%',
	// 		movement: 'converge',
	// 		shape: 'circle',
	// 		num: 30,
	// 		maxSpeed: 3,
	// 		maxSize: 8,
	// 		style: 'solid',
	// 		transitionIn: 'fade',
	// 		transitionOut: 'fade',
	// 		transitionThreshold: 0.3
	// 	}
	// );

	// generate other shapes in second canvas
	shapesCreator.add(
		'#dxp-background2',
		{
			canvasWidth: '50%',
			canvasHeight: '80%',
			shape: 'hexagon',
			movement: 'expand',
			num: 14,
			maxSpeed: 3,
			maxSize: 8,
			style: 'outline',
			transitionIn: 'fade',
			transitionOut: 'fade',
			transitionThreshold: 0.3
		}
		);

	// shapesCreator.add(
	// 	'#dxp-background2',
	// 	{
	// 		shape: 'circle',
	// 		movement: 'expand',
	// 		num: 14,
	// 		maxSpeed: 3,
	// 		maxSize: 8,
	// 		style: 'outline',
	// 		transitionIn: 'fade',
	// 		transitionOut: 'fade',
	// 		transitionThreshold: 0.3
	// 	}
	// );

	// shapesCreator.add(
	// 	'#dxp-background2',
	// 	{
	// 		shape: 'rectangle',
	// 		movement: 'expand',
	// 		num: 14,
	// 		maxSpeed: 3,
	// 		maxSize: 8,
	// 		style: 'outline',
	// 		transitionIn: 'fade',
	// 		transitionOut: 'fade',
	// 		transitionThreshold: 0.3
	// 	}
	// );
})();
