var mousePressed = false;
var lastX, lastY;
var ctx;
var img = new Image();
img.src = "";

function InitThis() {
    ctx = document.getElementById('myCanvas').getContext("2d");

    $('#myCanvas').on( "vmousedown", function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas').on( "vmousemove", function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas').on( "vmouseup", function (e) {
        mousePressed = false;
    });
	    $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });
}

function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
		ctx.globalAlpha=0.05;
        ctx.strokeStyle = $('#selColor').val();
        ctx.lineWidth = $('#lineWidth').val();
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
		ctx.globalAlpha=1;
    }
    lastX = x; lastY = y;
}
	
$(function() {
    $("#unobtrusive").click(function(e) {
      clearArea();
    });
  });	
	
function clearArea() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	img.src = drawImg;
	setTimeout(function() { ctx.drawImage(img, 0, 0, 280, 280);}, 300);
    
}