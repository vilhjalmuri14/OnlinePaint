class Shape {
	constructor(x, y, color) {
		this.startX = x;
		this.startY = y;
		this.color = color;
	}

	setEnd(x, y) {
		this.endX = x;
		this.endY = y;
	}
}

class Rectangle extends Shape {
	constructor(x, y, color) {
		super(x, y, color);
	}

	draw(context) {
		context.strokeStyle = this.color;
		context.strokeRect(this.startX, this.startY, this.endX - this.startX, this.endY - this.startY);
	}
}

class Line extends Shape {
	constructor(x, y, color) {
		super(x, y, color);
	}

	draw(context) {
		context.fillStyle = this.color;

		context.beginPath();
		context.moveTo(this.startX, this.startY);
		context.lineTo(this.endX, this.endY);

		context.lineWidth = 10;
		context.strokeStyle = this.color;
		context.stroke();
	}
}

class Circle extends Shape {
	constructor(x, y, color) {
		super(x, y, color);
	}

	draw(context) {
		context.beginPath();

		var radius = Math.sqrt(Math.pow(Math.abs(this.startX - this.endX), 2) 
					+ Math.pow(Math.abs(this.startY - this.endY),2));
		context.arc(this.startX, this.startY, radius, 0, 2 * Math.PI, false );

		// TODO: change this
		context.lineWidth = 5;
		context.strokeStyle = this.color;
		context.stroke();
	}
}

class Pen extends Shape {
		
	constructor(x, y, color) {
		super(x, y, color);
		this.points = [];
	}
	
	setEnd(x, y) {
		this.points.push({x: x, y: y});
	}

	draw(context) {
		// TODO: loop through the points and print

	}
}

var settings =  {
	canvasObj: document.getElementById("myCanvas"),
	nextObject: "Line",
	nextColor: "Red",
	isDrawing: false,
	currentShape: undefined,
	shapes: [],
	redo: []
};

$(document).ready(function(){

	$("#myCanvas").on("mousedown", function(e) {

		settings.isDrawing = true;
		document.getElementById("redo").disabled = true;
		settings.redo = [];
		var shape = undefined;
		var context = settings.canvasObj.getContext("2d");

		if(settings.nextObject === "Circle") {
			shape = new Circle((e.pageX - this.offsetLeft), (e.pageY - this.offsetTop), settings.nextColor);
		}
		else if(settings.nextObject === "Rectangle") {
			shape = new Rectangle((e.pageX - this.offsetLeft), (e.pageY - this.offsetTop), settings.nextColor);
		}
		else if(settings.nextObject === "Line") {
			shape = new Line((e.pageX - this.offsetLeft), (e.pageY - this.offsetTop), settings.nextColor);
		}

		settings.currentShape = shape;
		settings.shapes.push(shape);

		shape.draw(context);
	});

	$("#myCanvas").on("mousemove", function(e) {

		if(settings.currentShape !== undefined) {
			// updating the end position of the current shape
			settings.currentShape.setEnd((e.pageX - this.offsetLeft), (e.pageY - this.offsetTop));
		}

		drawAll();
	});

	$("#myCanvas").on("mouseup", function(e) {
		settings.currentShape = undefined;
	});

	function drawAll() {
		var context = settings.canvasObj.getContext("2d");
		// clearing the canvasObj
		context.clearRect(0,0,1000,500);

		// drawing all the objects
		for(var i = 0; i < settings.shapes.length; i++) {
			settings.shapes[i].draw(context);
		}
	}

	$("input[name='tool']").click(function() {
        var toolValue = $("input[name='tool']:checked").attr('id');
        var toolObj;
        if (toolValue === "circleButton") {
        	toolObj = "Circle";
        }
        if (toolValue === "rectangleButton") {
        	toolObj = "Rectangle";
        }
        if (toolValue === "lineButton") {
        	toolObj = "Line";
        }
        if (toolValue === "textButton") {
        	toolObj = "Text";
        }
        if (toolValue === "penButton") {
        	toolObj = "Pen";
        }

        settings.nextObject = toolObj;
    });

	$("#undo").click(function(e) {
		settings.redo.push(settings.shapes.pop());
		document.getElementById("redo").disabled = false;
		drawAll();
	});

	$("#redo").click(function(e) {
		settings.shapes.push(settings.redo.pop());
		drawAll();
	});

});


