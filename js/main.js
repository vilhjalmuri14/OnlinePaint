/* 
$(document).ready(function(){
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");


	var startX = 0;
	var startY = 0;
	var isDrawing = false;

	$("#myCanvas").mousedown(function(e){
		//console.log("inside mousedown");

		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		
		startX = x;
		startY = y;

		isDrawing = true;

		//console.log("X: " + x + " Y: " + y);

		//context.fillStyle = "blue";
		//context.fillRect(x - 30, y - 30, 60, 60);
		//context.strokeStyle = "red";
		//context.strokeRect(x - 30, y - 30, 60, 60);

		
	});

	$("#myCanvas").mousemove(function(e){
		if( isDrawing === true ) {
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;  

			// clearing the screen
			context.clearRect(0,0,500,500);

			context.beginPath();
			context.moveTo(startX, startY);
			context.lineTo(x, y);
			context.stroke();
		}
	});

	$("#myCanvas").mouseup(function(e){
		

		isDrawing = false;
	});
});
*/

// the code from lecture

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

class Pen extends Shape {
		
		constructor(x, y, color) {
			super(x, y, color);
			this.points = [];
		}

		setEnd(x, y) {
			this.points.push({x: x, y: y});
		}

		draw(context) {
			
		}
}

var settings =  {
	canvasObj: document.getElementById("myCanvas"),
	nextObject: "Rectangle",
	nextColor: "Red",
	isDrawing: false,
	currentShape: undefined,
	shapes: []
};

$(document).ready(function(){

	$("#myCanvas").on("mousedown", function(e) {

		settings.isDrawing = true;

		var shape = undefined;
		var context = settings.canvasObj.getContext("2d");

		if(settings.nextObject === "circle") {
			//shape = new Circle( TODO: find x and y , settings.nextColor);
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

});


