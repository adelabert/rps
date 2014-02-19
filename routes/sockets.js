//sockets.js
module.exports = function(sockets) {
	//include game module
	var loadGame = require('./middle/game.js')();

	//include two player game functions
	var twoPlayer = require('./middle/twoPlayer.js')();

	//load rock, paper, scissor
	var rps = new loadGame.Game('Rock, Paper, Scissors', 2);
	console.log(rps);

	//room info
	var room = {
		'users': []
	};

	//user constructor
	function User(socketId, username){
		this.socketId = socketId;
		this.username = username;
		this.free 		= true;
	}

	//deleting a user from the room
	function pruneUser(socketId, users){
		for(var i=0; i<users.length; i++){
			if(users[i].socketId==socketId){
				users.splice(i,1);
				break;
			}
		}
	}

	//adding a user to the room
	function addUser(socketId, username, userArray){
		var tempUser = new User(socketId, username);
		userArray.push(tempUser);
	}


	function toAll(socket, toHappen, data){
		socket.emit(toHappen, data);
		socket.broadcast.emit(toHappen, data);
	}

	//Set all event listeners for each new socket
	sockets.on('connection', function(socket){

		socket.on('frmClient:login', function(username){
			addUser(socket.id, username, room.users);
			toAll(socket, 'frmServer:refreshRoom', room);
		});
		
		socket.on('disconnect', function(){
			pruneUser(socket.id, room.users);
			socket.broadcast.emit('frmServer:refreshRoom', room);
		});

		socket.emit('frmServer:login');
	});
};