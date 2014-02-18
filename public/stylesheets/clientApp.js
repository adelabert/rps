//asidjfs

alert('hi');
alert(window.location.hostname);
var socket = io.connect(window.location.hostname + ':3000');
socket.on('frmServer:login', function(){
	var username = prompt('Pick a username: ');
	socket.emit('frmClient:login', username);
});