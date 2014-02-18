//sockets.js
module.exports = function(sockets) {
	//room info
	var room = {
		'users': []
	};

	var twoPlayer = require('./middle/twoPlayer.js')();

	function User(socketId, username){
		this.socketId = socketId;
		this.username = username;
		this.rank			= room.users.length + 1;
	}

	function pruneUser(socketId, users){
		for(var i=0; i<users.length; i++){
			if(users[i].socketId==socketId){
				users.splice(i,1);
				console.log('users: ' + users);
				break;
			}
		}
		return users;
	}

	function addUser(socketId, username, userArray){
		var tempUser = new User(socketId, username);
		userArray.push(tempUser);
	}

	//Set all event listeners for each new socket
	sockets.on('connection', function(socket){
		socket.on('frmClient:login', function(username){
			addUser(socket.id, username, room.users);
			console.log(room.users);
			socket.emit('frmServer:updateUsers', room.users);
			socket.broadcast.emit('frmServer:updateUsers', room.users);
		});
		
		socket.on('disconnect', function(){
			room.users = pruneUser(socket.id, room.users);
			socket.broadcast.emit('frmServer:updateUsers', room.users);
		});

		socket.emit('frmServer:login');
		
	});
};



























/*
var ZachApp = function () {
	var privateVariable = 1;

	function doSomethingPrivate() {

	}

	return {
		doSomething: function() {
			return privateVariable;
		};

		doSomethingElse: function() {
			privateVariable++;
		};

	};

}();

ZachApp:
	{
		doSomething: ...
		doSomethingElse: ...
	}*/