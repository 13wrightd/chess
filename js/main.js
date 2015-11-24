var socket = io();

$(document).ready(function(){
	console.log('document ready');
	$('#button').click(function(){
			socket.emit('button clicked', $('#firstNameField').val());
	});

	socket.on('button was clicked', function(msg){
		console.log('button was clicked, message received');
	});
});


