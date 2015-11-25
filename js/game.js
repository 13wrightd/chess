// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// trump image
var trumpReady = false;
var trumpImage = new Image();
trumpImage.onload = function () {
	trumpReady = true;
};
trumpImage.src = "images/trumpGnome.jpg";

// carson image
var carsonReady = false;
var carsonImage = new Image();
carsonImage.onload = function () {
	carsonReady = true;
};
carsonImage.src = "images/carsonGnome.jpg";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var trump = {
	speed: 256 // movement in pixels per second
};
var carson = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var trumpCaught = 0;
var carsonCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	//trump.x = canvas.width / 2;
	//trump.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if(trump.y > 0){
			trump.y -= trump.speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		if(trump.y < 448) {
			trump.y += trump.speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		if(trump.x > 0){
			trump.x -= trump.speed * modifier;
		}
	}
	if (39 in keysDown) { // Player holding right
		if(trump.x < 480) {
			trump.x += trump.speed * modifier;
		}
	}

	if (87 in keysDown) { // Player holding up
		if(carson.y > 0){
			carson.y -= carson.speed * modifier;
		}
	}
	if (83 in keysDown) { // Player holding down
		if(carson.y < 448) {
			carson.y += carson.speed * modifier;
		}
	}
	if (65 in keysDown) { // Player holding left
		if(carson.x > 0){
			carson.x -= carson.speed * modifier;
		}
	}
	if (68 in keysDown) { // Player holding right
		if(carson.x < 480) {
			carson.x += carson.speed * modifier;
		}
	}

	// Are trump and monster touching?
	if (
		trump.x <= (monster.x + 32)
		&& monster.x <= (trump.x + 32)
		&& trump.y <= (monster.y + 32)
		&& monster.y <= (trump.y + 32)
	) {
		++trumpCaught;
		reset();
	}

	// Are carson and monster touching?
	if (
		carson.x <= (monster.x + 32)
		&& monster.x <= (carson.x + 32)
		&& carson.y <= (monster.y + 32)
		&& monster.y <= (carson.y + 32)
	) {
		++carsonCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (trumpReady) {
		ctx.drawImage(trumpImage, trump.x, trump.y);
	}

	if (carsonReady) {
		ctx.drawImage(carsonImage, carson.x, carson.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Trump: " + trumpCaught + " Carson: " + carsonCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
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
reset();
trump.x = canvas.width / 2;
trump.y = canvas.height / 2;

carson.x = canvas.width / 2;
carson.y = canvas.height / 2;

main();
