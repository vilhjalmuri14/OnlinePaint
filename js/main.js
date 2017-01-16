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