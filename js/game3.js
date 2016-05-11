var socket = io();
var players;

//socket.emit('initialize');
socket.on('players update', function(msg){
	players=msg;
	// for(var i=0;i<players.players.length;i++){    //for images
	// 	players.players[i].image=new Image();
	// 	players.players[i].image.src = "images/trumpGnome.jpg";
	// }
})

// Create the canvas
var x=50;
var y=50;
var counter=0;
var wait=0;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1800;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";
playerImage0 = new Image();
playerImage0.onload = function () {
	bgReady = true;
};

playerImage0.src="images/still/0.gif"

playerImage1 = new Image();
playerImage1.onload = function () {
	bgReady = true;
};

playerImage1.src="images/still/1.gif"


///////////////////////////////////

runImages=new Array();
runImages[0] = new Image();
runImages[0].onload = function () {
	bgReady = true;
};

runImages[0].src="images/run/0.gif"
//
runImages[1] = new Image();
runImages[1].onload = function () {
	bgReady = true;
};

runImages[1].src="images/run/1.gif"
//
runImages[2] = new Image();
runImages[2].onload = function () {
	bgReady = true;
};

runImages[2].src="images/run/2.gif"
//
runImages[3] = new Image();
runImages[3].onload = function () {
	bgReady = true;
};

runImages[3].src="images/run/3.gif"
//
runImages[4] = new Image();
runImages[4].onload = function () {
	bgReady = true;
};

runImages[4].src="images/run/4.gif"
//
runImages[5] = new Image();
runImages[5].onload = function () {
	bgReady = true;
};

runImages[5].src="images/run/5.gif"
//




// Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	socket.emit('key change', keysDown);
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
	socket.emit('key change', keysDown);
}, false);
var run=0;

var update = function () {
	if (38 in keysDown) { // Player holding up
		if(y > 0){
			y -= 1;
		}
	}
	if (40 in keysDown) { // Player holding down
		if(y < 448) {
			y += 1;
		}
	}
	if (37 in keysDown) { // Player holding left
		if(x > 0){
		//	x -= 10;
		}
	}
	if (39 in keysDown) { // Player holding right
		run=1;
		// if (counter%10==0){

		// }
		runFrame=((runFrame+1)%6);
		if(x < 480) {
		//	x += 2;
		}
	}
	else{
		run=0;
		runFrame=0;
	}
};



var update2 = function () {
	if (38 in keysDown) { // Player holding up
		if(y > 0){
			y -= 1;
		}
	}
	if (40 in keysDown) { // Player holding down
		if(y < 448) {
			y += 1;
		}
	}
	if (37 in keysDown) { // Player holding left
		if(x > 0){
			x -= 4;
		}
	}
	if (39 in keysDown) { // Player holding right
		if(x < 1400) {
			x += 4;
		}
	}
};


// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
		ctx.drawImage(bgImage, 480, 0);
		ctx.drawImage(bgImage, 960, 0);
		ctx.drawImage(bgImage, 960+480, 0);
	}
	if (players!= null && players != undefined){
	for(var i=0; i<players.players.length;i++){
		//ctx.drawImage(players.players[i].image,players.players[i].x,players.players[i].y);
		//ctx.fillStyle=players.players[i].color;
		//ctx.fillRect(players.players[i].x,players.players[i].y, 32,32);
	}}

	//ctx.drawImage(playerImage, 40, 50);
	
	if (wait&& (!run)){
		ctx.drawImage(playerImage0, x, y);
	}
	else if ((!wait) &&(!run)){
		ctx.drawImage(playerImage1, x, y);
	}
	if (run){
		ctx.drawImage(runImages[runFrame], x, y);
	}
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("score: " , 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	counter++;
	if(counter>10000000){
		counter=0;
	}
	if(counter%15==0){
	wait=!wait;
}
	var delta = now - then;
	update2();
	if(counter%5==0){
	update();
	
    }
	render();
	then = now;
	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
// Let's play this game!
var then = Date.now();
main();
