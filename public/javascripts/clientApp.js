var socket = io.connect('http://localhost:3000');

socket.on('frmServer:login', function(){
	var username = prompt('Pick a username: ');
	socket.emit('frmClient:login', username);
});

socket.on('startingHigher', function(players){
	alert('starting a game with a lower player');
});
socket.on('startingLower', function(players){
	alert('starting a game with a higher player');
});




