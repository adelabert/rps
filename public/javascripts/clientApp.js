var socket = io.connect('http://localhost:3000');

socket.on('frmServer:login', function(){
	var username = prompt('Pick a username: ');
	socket.emit('frmClient:login', username);
});

socket.on('frmServer:updateUsers', function(users){
	var temp = '';
	for(var i=0; i<users.length; i++){
		temp += users[i].username;
		temp += '</br>';
	}
	$('#userList').html(temp);
});