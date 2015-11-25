'use strict';

var app = require('express')();
var http = require('http').Server(app);

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

app.get('/game', function (req, res) {
  res.sendFile(__dirname+ '/game.html');
});



//models
var message = require('./models/message.js');
var a = new message({
  name:'dan',
  message:'hey'

});

a.save(function(error){
  if (error){
    console.log(':(');
  }
  else{
    console.log(':)');
  }
})




io.on('connection', function(socket) {
  //clients.push(socket.id);   //not necessary but useful for storing users and sending messages to them
  //io.sockets.connected[socket.id].emit("message-history", messageHistoryObject.getMessages());

  socket.on('button clicked', function(msg) {
    io.emit('button was clicked', msg);
  });
});

var server = http.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('our app listening  at http://%s:%s', host, port);
});
