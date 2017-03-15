var canvas = document.getElementById('dxp-background');
var context = canvas.getContext('2d');

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;
var w = 100;
var h = 100;
var incr = 0.05;
var xPos = 0;
var dest = context.canvas.width - w;

var drawCircle = function(opts) {
    context.clearRect(0, 0, 500, 500);
    context.translate(incr, 0);

    var startAngle = (Math.PI / 180) * 0;
    var endAngle = (Math.PI / 180) * 360;
    context.shadowColor = "white";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    // context.shadowBlur = 15;
    context.globalAlpha = 0.5;

    // context.save();

    //B2. DRAW CIRCLE
    context.beginPath();
    context.arc(
    	15,
    	15,
    	10,
        startAngle,
        endAngle,
        false);

    xPos += incr;
	  if(xPos <= 0 || dest <= xPos) {
	    incr *= -1;
	  }

    context.fillStyle = "white";
    context.fill();

    window.setInterval(drawCircle, 1);
};


var generateRandomCircles = function(canvas) {
    var config = {
        numCircles: 20,
        maxRadius: 20,
        minRadius: 3
    };

    var context = canvas.getContext('2d');

    for (var n = 0; n < config.numCircles; n++) {
        var xPos = Math.random() * canvas.width;
        var yPos = Math.random() * canvas.height;
        var radius = config.minRadius + (Math.random() * (config.maxRadius - config.minRadius));
        var colorIndex = Math.random() * (1);
        colorIndex = Math.round(colorIndex);
        var color = "white";

        // A5. DRAW circle.
        drawCircle({
        	context: context,
        	xPos: xPos,
        	yPos: yPos,
        	radius: radius,
        	color: color
        });
    }

    window.requestAnimationFrame(drawCircle);

};

drawCircle();
