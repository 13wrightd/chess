'use strict';

var app = require('express')();
var http = require('http').Server(app);
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
//app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");


// 1
var io = require('socket.io')(http);

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin1:admin3141@ds057944.mongolab.com:57944/chess');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error: '));
db.once('open', function(){
    console.log('Database connected.');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname+ '/index.html');
  console.log('someone loaded homepage');
});
app.get('/js/*', function (req, res) {
  res.sendFile(__dirname+ req.path);
});

app.get('/images/*', function (req, res) {
  res.sendFile(__dirname+ req.path);
});
app.get('/images/still/*', function (req, res) {
  res.sendFile(__dirname+ req.path);
});
app.get('/images/run/*', function (req, res) {
  res.sendFile(__dirname+ req.path);
});
app.get('/game', function (req, res) {
  res.sendFile(__dirname+ '/game.html');
});
app.get('/g2', function (req, res) {
  res.sendFile(__dirname+ '/game2.html');
});
app.get('/art', function (req, res) {
  res.sendFile(__dirname+ '/art.html');
});




//game
var height=1600;
var width=900;

function player(xStart, yStart, socketId){
  
  if(xStart){
   this.x=xStart;
  }
  else{
    this.x=width/2;
  }
  if(yStart){
    this.y=yStart;  
  }
  else{
    this.y=height/2;
  }
  this.xOld=this.x;
  this.color= getRandomColor();
  this.socketId=socketId;//guid();
  this.speed=1;

  this.yOld=this.y;
  this.keys=[];
}

player.prototype.update = function(){
  // w = 38
  // a = 65
  // s = 83
  // d = 68
  if('87' in this.keys){  //w up
      this.y-=this.speed;
  }
  if('83' in this.keys){  //s down
      this.y+=this.speed;
  }
  if('65' in this.keys){  //a left
      this.x-=this.speed;
  }
  if('68' in this.keys){  //d right
      this.x+=this.speed;
  }

  // if(this.keys.length>0){
  //   io.emit('player position', this);
  // }
}

function playerList(){
  this.players=new Array;
}
playerList.prototype.add = function(socketId){
  this.players.push(new player(200,200, socketId));
}

playerList.prototype.removeBySocketId = function(socketId){
  for(var i = 0; i<this.players.length;i++){

    if (this.players[i].socketId==socketId){
      this.players.splice(i,1);
      break
    }
  }
}

playerList.prototype.changeKeysBySocketId = function(socketId, keys){
  for(var i = 0; i<this.players.length;i++){
    if (this.players[i].socketId==socketId){
      this.players[i].keys=keys;
    }
  }
}

playerList.prototype.update = function(){
  for(var i = 0; i<this.players.length;i++){
    this.players[i].update();
  }
}

//game loop

var players= new playerList();

setInterval(function(){ 
  players.update();
  io.emit('players update', players);

}, 10);







io.on('connection', function(socket) {
  //clients.push(socket.id);   //not necessary but useful for storing users and sending messages to them
  //io.sockets.connected[socket.id].emit("message-history", messageHistoryObject.getMessages());

/*
var messageSchema = mongoose.Schema({
  name: String,
  message: String,
  dateSent: { type: Date, default: Date.now }
});

var messages = mongoose.model('message', messageSchema);
*/


  
  //var thePost = require('./models/message.js');

  //mongoose.model('post', thePost);
  //var posts = db.model('post');
  //var posts = mongoose.model('posts', thePost);

  //posts.find({}, [], function(err, calls) { 
    //console.log(err, calls, calls.length);  //prints out: null [] 0
  //});


 // io.emit(/*last ten messages*/)



  players.add(socket.id);
  io.emit('players update', players);
  socket.on('key change', function(msg) {
    players.changeKeysBySocketId(socket.id, msg);
  });
  socket.on('disconnect', function() {
    console.log('someone left');
    players.removeBySocketId(socket.id);
  });

  socket.on('button clicked', function(msg) {

    io.emit('button was clicked', msg);

      var message = require('./models/message.js');
      var a = new message({
          name: msg.first + ' ' + msg.last,
          message:msg.message
      })

      a.save(function(error){
        if (error){
            console.log(':(');
          }
          else{
            console.log(':)');
          }
      })
  });
});

// http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
//     console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
//     server();
// });

// var server = http.listen(app.get('port') ,app.get('ip'), function () {
//     console.log("Express server listening at %s:%d ", app.get('ip'),app.get('port'));
// });


var server = http.listen(app.get('port') , function () {
    console.log("Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});


// function guid() {
//   function s4() {
//     return Math.floor((1 + Math.random()) * 0x10000)
//       .toString(16)
//       .substring(1);
//   }
//   return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//     s4() + '-' + s4() + s4() + s4();
// }

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}