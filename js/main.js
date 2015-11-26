var socket = io();

$(document).ready(function(){
	console.log('document ready');


		
	$('#button').click(function(){
	var msg=
	{
  		first: $('#firstNameField').val(),
  		last: $('#lastNameField').val(),
  		message: $('#messageField').val()
	}
  		
		socket.emit('button clicked', msg);
	});

	$('#messageField').keypress(function(event){
	var msg=
	{
  		first: $('#firstNameField').val(),
  		last: $('#lastNameField').val(),
  		message: $('#messageField').val()
	}
  		
		
		if(event.which == '13'){
			socket.emit('button clicked', msg);
		}
	})

	socket.on('button was clicked', function(msg){
		console.log(msg.first+ ' '+ msg.last+ ' clicked, message received');
		$('#chat').append('<li>'+msg.first+ " " + msg.last+ ": " +msg.message+'</li>');
	});
});


