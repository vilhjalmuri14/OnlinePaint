class Shape {
	constructor(x, y, color, lineWidth) {
		this.startX = x;
		this.startY = y;
		this.color = color;
		this.lineWidth = lineWidth;
		this.classType = "Shape";
	}

	setEnd(x, y) {
		this.endX = x;
		this.endY = y;
	}
}

class Rectangle extends Shape {
	constructor(x, y, color, lineWidth) {
		super(x, y, color, lineWidth);
		this.classType = "Rectangle";
	}

	draw(context) {
		context.strokeStyle = this.color;
		context.strokeRect(this.startX, this.startY, this.endX - this.startX, this.endY - this.startY);
	}
}

class Line extends Shape {
	constructor(x, y, color, lineWidth) {
		super(x, y, color, lineWidth);
		this.classType = "Line";
	}

	draw(context) {
		context.fillStyle = this.color;

		context.beginPath();
		context.moveTo(this.startX, this.startY);
		context.lineTo(this.endX, this.endY);

		context.lineWidth = this.lineWidth;
		context.strokeStyle = this.color;
		context.stroke();
	}
}

class Circle extends Shape {
	constructor(x, y, color, lineWidth) {
		super(x, y, color, lineWidth);
		this.classType = "Circle";
	}

	draw(context) {
		context.beginPath();

		var radius = Math.sqrt(Math.pow(Math.abs(this.startX - this.endX), 2) 
					+ Math.pow(Math.abs(this.startY - this.endY),2));
		context.arc(this.startX, this.startY, radius, 0, 2 * Math.PI, false );

		// TODO: change this
		context.lineWidth = this.lineWidth;
		context.strokeStyle = this.color;
		context.stroke();
	}
}

class Text extends Shape {
	constructor(x, y, color) {
		super(x, y, color);
		this.classType = "Text";
		this.theText = undefined;

		// opening the textarea
		var t = $("#canvasTextarea");
		t.show();
		t.offset({top: (this.startY + 80), left: this.startX });
	}

	draw(context) {

		if(this.theText !== undefined) {
			context.font = "32px serif";
			context.fillStyle = this.color;
  			context.fillText(this.theText, this.startX, this.startY);
		}
	}
}

class Pen extends Shape {
		
	constructor(x, y, color, lineWidth) {
		super(x, y, color, lineWidth);
		this.points = [];
	}
	
	setEnd(x, y) {
		this.points.push({x: x, y: y});
	}

	draw(context) {
		// looping through the points and creating lines between them
		for(var i = 1; i < this.points.length; i++) {
			context.fillStyle = this.color;
			context.beginPath();
			context.moveTo(this.points[i-1].x, this.points[i-1].y);
			context.lineTo(this.points[i].x, this.points[i].y);
			context.lineWidth = this.lineWidth;
			context.strokeStyle = this.color;
			context.stroke();
		}
	}
}

var settings =  {
	canvasObj: document.getElementById("myCanvas"),
	nextObject: "Text",
	nextColor: "Black",
	lineWidth: "2",
	isDrawing: false,
	currentShape: undefined,
	shapes: [],
	redo: []
};

$(document).ready(function(){

	$('#selector label').click( function() {
		$(this).addClass('active').siblings().removeClass('active');
	});

	$("#myCanvas").on("mousedown", function(e) {

		settings.isDrawing = true;
		document.getElementById("redo").disabled = true;
		settings.redo = [];
		document.getElementById("undo").disabled = false;
		document.getElementById("clearAll").disabled = false;
		var shape = undefined;
		var context = settings.canvasObj.getContext("2d");

		if(settings.nextObject === "Circle") {
			shape = new Circle((e.pageX - this.offsetLeft), (e.pageY - this.offsetTop), settings.nextColor, settings.lineWidth);
		}
		else if(settings.nextObject === "Rectangle") {
			shape = new Rectangle((e.pageX - this.offsetLeft), (e.pageY - this.offsetTop), settings.nextColor, settings.lineWidth);
		}
		else if(settings.nextObject === "Line") {
			shape = new Line((e.pageX - this.offsetLeft), (e.pageY - this.offsetTop), settings.nextColor, settings.lineWidth);
		}
		else if(settings.nextObject === "Pen") {
			shape = new Pen((e.pageX - this.offsetLeft), (e.pageY - this.offsetTop), settings.nextColor, settings.lineWidth);	
		}
		else if(settings.nextObject === "Text") {
			shape = new Text((e.pageX - this.offsetLeft), (e.pageY - this.offsetTop), settings.nextColor, settings.lineWidth);		
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

    $("input[name='color']").click(function() {
        var colorValue = $("input[name='color']:checked").attr('id');
        var colorObj;
        if (colorValue === "blackColor") {
        	colorObj = "Black";
        }
        if (colorValue === "redColor") {
        	colorObj = "Red";
        }
        if (colorValue === "blueColor") {
        	colorObj = "Blue";
        }
        if (colorValue === "yellowColor") {
        	colorObj = "Yellow";
        }

        settings.nextColor = colorObj;
    });

	$('input[name="lineWidth"]').change(function() {
        var widthValue = $('input[name="lineWidth"]').val();
        settings.lineWidth = widthValue;
    });

	$("#undo").click(function(e) {
		settings.redo.push(settings.shapes.pop());
		document.getElementById("redo").disabled = false;
		if(settings.shapes.length < 1) {
			document.getElementById("undo").disabled = true;
		}
		drawAll();
	});

	$("#redo").click(function(e) {
		settings.shapes.push(settings.redo.pop());
		document.getElementById("undo").disabled = false;
				if(settings.redo.length < 1) {
			document.getElementById("redo").disabled = true;
		}
		drawAll();
	});

	$("#clearAll").click(function(e) {
		settings.redo = [];
		settings.shapes = [];
		document.getElementById("redo").disabled = true;
		document.getElementById("undo").disabled = true;
		document.getElementById("clearAll").disabled = true;
		drawAll();
	});

	$("#saveButton").click(function(e) {
		var drawing = {
		    title: $("#saveTitle").val(),
		    content: settings.shapes
		};
		var url = "http://localhost:3000/api/drawings";

		$.ajax({
		    type: "POST",
		    contentType: "application/json; charset=utf-8",
		    url: url,
		    data: JSON.stringify(drawing),
		    success: function (data) {
		        $('#saveModal').modal('hide');
		    },
		    error: function (xhr, err) {
		        // The drawing could NOT be saved
			}
		});
	});

	$("#canvasTextarea").keypress(function(e) {

		// if you press enter you close the textarea
		// and the text writes to the canvas
	    if(e.which == 13) {
	        settings.currentShape.theText = $(this).val();
	        $(this).val("");
	        $(this).hide();
	    }
	});

});

