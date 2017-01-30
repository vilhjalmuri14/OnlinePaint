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
		context.lineWidth = this.lineWidth;
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
		if(pageX !== 0 && pageY !== 0) {
			var t = $("#canvasTextarea");
			t.show();
			t.offset({top: pageY, left: pageX});	
		}
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
		this.classType = "Pen";
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