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

	move(deltaX, deltaY) {
		this.startX = this.startX + deltaX;
		this.startY = this.startY + deltaY;
		this.endX = this.endX + deltaX;
		this.endY = this.endY + deltaY;
	}

	drawSelected(context) {
		context.strokeStyle = "black";
		context.fillRect(this.startX, this.startY, 10, 10);

		context.strokeStyle = "black";
		context.fillRect(this.endX, this.endY, 10, 10);
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

	isSelected(x, y) {
		if((x > this.startX && x < this.endX) || (x < this.startX && x > this.endX)) {
			if((y < this.startY && y > this.endY) || (y > this.startY && y < this.endY)) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
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

	isSelected(x, y) {
		if((x > this.startX && x < this.endX) || (x < this.startX && x > this.endX)) {
			if((y < this.startY && y > this.endY) || (y > this.startY && y < this.endY)) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
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

	isSelected(x, y) {
		var radius = Math.sqrt(Math.pow(Math.abs(this.startX - this.endX), 2) 
					+ Math.pow(Math.abs(this.startY - this.endY),2));

		var selectRadius = Math.sqrt(Math.pow(Math.abs(this.startX - x), 2) 
					+ Math.pow(Math.abs(this.startY - y),2));

		if(selectRadius < radius) {
			return true;
		}
		else {
			return false;
		}
	}
}

class Text extends Shape {
	constructor(pageX, pageY, x, y, color, font, textSize) {
		super(x, y, color);
		this.classType = "Text";
		this.theText = undefined;
		this.textSize = textSize;
		this.font = font;
		this.textLenght = 0;

		// opening the textarea
		var t = $("#canvasTextarea");
		t.show();
		t.offset({top: pageY, left: pageX});
	}

	draw(context) {

		if(this.theText !== undefined) {
			context.font = this.textSize + "px " + this.font;
			context.fillStyle = this.color;
  			context.fillText(this.theText, this.startX, this.startY);
  			this.textLenght = context.measureText(this.theText).width;
  			this.endX = this.startX + this.textLenght; 
  			this.endY = this.startY;
		}
	}

	isSelected(x, y) {
		if(((this.startX < x) && (this.endX > x)) && (((this.endY - y) > 0) && ((this.endY - y) < 30))) {
			return true;
		}
		else {
			return false;
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
		this.endX = x;
		this.endY = y;
	}

	move(deltaX, deltaY) {
		this.startX = this.startX + deltaX;
		this.startY = this.startY + deltaY;
		this.endX = this.endX + deltaX;
		this.endY = this.endY + deltaY;

		for(var i = 0; i < this.points.length; i++) {
			this.points[i].x = this.points[i].x + deltaX;
			this.points[i].y = this.points[i].y + deltaY;
		}
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

	isSelected(x, y) {
		for(var i = 1; i < this.points.length; i++) {
			if((Math.abs(this.points[i].x - x) < 20) && (Math.abs(this.points[i].y - y) < 20)) {
				return true;
			}
		}
		return false;
	}
}

var settings =  {
	canvasObj: document.getElementById("myCanvas"),
	nextObject: "Pen",
	nextColor: "Black",
	lineWidth: 2,
	font: "Arial",
	textSize: 8,
	isDrawing: false,
	currentShape: undefined,
	selectedShape: undefined,
	selectPoints: undefined,
	shapes: [],
	redo: []
};

$(document).keypress(function(e) {
	alert("Bjadni er svosem alveg fínn kall");
});

$(document).ready(function(){

	$(document).ready(function() {
		$(".dropdown-toggle").dropdown();
	});

	$('#selector label').click( function() {
		$(this).addClass('active').siblings().removeClass('active');
	});

	$('.dropdown-menu li').click( function() {
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

		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;

		if(settings.nextObject === "Circle") {
			shape = new Circle(x, y, settings.nextColor, settings.lineWidth);
		}
		else if(settings.nextObject === "Rectangle") {
			shape = new Rectangle(x, y, settings.nextColor, settings.lineWidth);
		}
		else if(settings.nextObject === "Line") {
			shape = new Line(x, y, settings.nextColor, settings.lineWidth);
		}
		else if(settings.nextObject === "Pen") {
			shape = new Pen(x, y, settings.nextColor, settings.lineWidth);	
		}
		else if(settings.nextObject === "Text") {
			shape = new Text(e.pageX, e.pageY, x, y, settings.nextColor, settings.font, settings.textSize);		
		}
		else if(settings.nextObject === "Select") {
			settings.selectedShape = undefined;
			settings.selectPoints = new Shape(x, y);

			// looping through all the object and check if they are selected
			for(var i = 0; i < settings.shapes.length; i++) {
				if(settings.shapes[i].isSelected(x, y)) {
					settings.selectedShape = settings.shapes[i];
					break;
				}
			}
		}

		settings.currentShape = shape;

		if(shape !== "Select" && shape !== undefined) {
			settings.shapes.push(shape);
			shape.draw(context);
		}
		if(settings.selectedShape !== undefined) {
			settings.selectedShape.drawSelected(context);
		}		
	});

	$("#myCanvas").on("mousemove", function(e) {
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;

		if(settings.selectedShape !== undefined && settings.selectPoints !== undefined) {
			// TODO: clean and finish this!!!!!!!!

			var shape = settings.selectedShape;
			var deltaX = x - settings.selectPoints.startX;
			var deltaY = y - settings.selectPoints.startY;

			settings.selectedShape.move(deltaX, deltaY);


			settings.selectPoints.startX = x;
			//settings.selectPoints.endX = x;
			settings.selectPoints.startY = y;
			//settings.selectPoints.endY = y;
		}

		if(settings.currentShape !== undefined) {
			// updating the end position of the current shape
			settings.currentShape.setEnd(x, y);
		}

		drawAll();
	});

	$("#myCanvas").on("mouseup", function(e) {
		settings.currentShape = undefined;
		settings.selectPoints = undefined;
	});

	$("label[name='tool']").click(function() {
        var toolValue = $("label[class='btn btn-primary active']").attr('id');
        var toolObj;

        if (toolValue === "circleButton") {
        	toolObj = "Circle";
        }
        else if (toolValue === "rectangleButton") {
        	toolObj = "Rectangle";
        }
        else if (toolValue === "lineButton") {
        	toolObj = "Line";
        }
        else if (toolValue === "textButton") {
        	toolObj = "Text";
        }
        else if (toolValue === "penButton") {
        	toolObj = "Pen";
        }
        else if (toolValue === "selectButton") {
        	toolObj = "Select";
        }

        settings.nextObject = toolObj;
    });

    $("#font-dropdown").click(function() {
    	var dropdownValue = $("li[class='active'][name='font-dropdown'").attr("id");
    	var fontObj;

    	if (dropdownValue === "arial") {
    		fontObj = "Arial";
    	}
    	else if (dropdownValue === "comicSans") {
    		fontObj = "Comic Sans MS";
    	}
    	else if (dropdownValue === "georgia") {
    		fontObj = "Georgia";
    	}
    	else if (dropdownValue === "timesNewRoman") {
    		fontObj = "Times New Roman";
    	}
    	else if (dropdownValue === "verdana") {
    		fontObj = "Verdana";
    	}
    	settings.font = fontObj;
    });

    $("#font-size-dropdown").click(function() {
    	var textSizeDropDownValue = $("li[class='active'][name='font-size-dropdown'").attr("id");
    	var textSizeObj;

    	if (textSizeDropDownValue === "font-size-8") {
    		textSizeObj = "8";
    	}
    	else if (textSizeDropDownValue === "font-size-12") {
    		textSizeObj = "12";
    	}
    	else if (textSizeDropDownValue === "font-size-16") {
    		textSizeObj = "16";
    	}
    	else if (textSizeDropDownValue === "font-size-32") {
    		textSizeObj = "32";
    	}
    	else if (textSizeDropDownValue === "font-size-64") {
    		textSizeObj = "64";
    	}

    	settings.textSize = textSizeObj;
    });

    $("label[name='color']").click(function() {
        var colorValue = $("label[class='btn btn-default active']").attr('id');
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

	$("#loadDrawingsButton").click(function(e) {
		$.getJSON( "http://localhost:3000/api/drawings", function(data) {
			var items = [];
		
			$.each(data, function(key, val) {
				items.push("<button type='button' class='myDrawingsList btn btn-primary btn-lg btn-block' data-drawingID='" 
							+ key + "'>" + val.title + "</button>");
			});

			$("#drawingsModal").html(items.join(""));	
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

function drawAll() {
	var context = settings.canvasObj.getContext("2d");
	// clearing the canvasObj
	context.clearRect(0,0,1000,500);

	// drawing all the objects
	for(var i = 0; i < settings.shapes.length; i++) {
		settings.shapes[i].draw(context);
	}

	// drawing the selected object if there is any
	if(settings.selectedShape !== undefined) {
		settings.selectedShape.drawSelected(context);
	}
}

$(document).on('click', '.myDrawingsList', function () {
    console.log($(this).attr("data-drawingID"));

    $.getJSON( "http://localhost:3000/api/drawings/" + $(this).attr("data-drawingID"), function(data) {
		settings.shapes = [];

		$.each(data.content, function(key, val) {
			var shape = undefined;
			var context = settings.canvasObj.getContext("2d");

			if(val.classType === "Circle") {
				shape = new Circle(val.startX, val.startY, val.color, val.lineWidth);
			}
			else if(settings.nextObject === "Rectangle") {
				shape = new Rectangle(val.startX, val.startY, val.color, val.lineWidth);
			}
			else if(settings.nextObject === "Line") {
				shape = new Line(val.startX, val.startY, val.color, val.lineWidth);
			}
			else if(settings.nextObject === "Pen") {
				shape = new Pen(val.startX, val.startY, val.color, val.lineWidth);
				// TODO: get all the points
				shape.points = val.points;
			}
			else if(settings.nextObject === "Text") {
				shape = new Text(val.startX, val.startY, val.color, val.lineWidth);
				shape.theText = val.theText;		
			}

			shape.setEnd(val.endX, val.endY);

			settings.shapes.push(shape);
			shape.draw(context);
		});

		drawAll();
	});
});



