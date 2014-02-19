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
		'users': [],
		'tables': [],
		'wait': []
	};

	//user constructor
	function User(socketId, username){
		this.socketId = socketId;
		this.username = username;
		this.rank			= room.users.length + 1;
	}

	//table constructor
	function Table(highChair, lowChair, waitChair, numPlayers){
		this.highChair  = highChair;
		this.lowChair   = lowChair;
		this.waitChair  = waitChair;
		this.numPlayers = numPlayers;
		this.order		  = Math.floor(room.users.length/this.numPlayers);
	}

	//deleting a user from the room
	function pruneUser(socketId, users){
		for(var i=0; i<users.length; i++){
			if(users[i].socketId==socketId){
				var prunedRank = users[i].rank;
				users.splice(i,1);
				break;
			}
		}
		return i;
	}

	//adding a user to the room
	function addUser(socketId, username, userArray){
		var tempUser = new User(socketId, username);
		userArray.push(tempUser);
	}

	function createTable(tableArray){
		console.log('creating new table: ');
		var tempTable = new Table('higher', 'lower', 'none', rps.numPlayers);
		console.log('new tempTable: ' + tempTable);
		tableArray.push(tempTable);
	}

	function toAll(socket, toHappen, data){
		socket.emit(toHappen, data);
		socket.broadcast.emit(toHappen, data);
	}
function numPlayersEven(){
	return (room.users.length%rps.numPlayers == 0);
}
	//Set all event listeners for each new socket
	sockets.on('connection', function(socket){
		socket.on('frmClient:login', function(username){

			addUser(socket.id, username, room.users);
			toAll(socket, 'frmServer:refreshRoom', room);

			//Check if enough for a new table
			if(numPlayersEven()){
				createTable(room.tables);
				toAll(socket, 'frmServer:refreshRoom', room);
				console.log('room send: ' + room);
			}
		});
		
		socket.on('disconnect', function(){
			if(numPlayersEven()){
				room.tables.pop();
			}
			var prunedRank = pruneUser(socket.id, room.users);
			twoPlayer.spliceRank(prunedRank, room.users);
			socket.broadcast.emit('frmServer:refreshRoom', room);
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