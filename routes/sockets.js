//sockets.js
module.exports = function(sockets) {
	//include game module
	var loadGame = require('./middle/game.js')();
/*
	//include two player game functions
	var twoPlayer = require('./middle/twoPlayer.js')();*/

	//load rock, paper, scissor
	var rps = new loadGame.gameMeta('Rock, Paper, Scissors', 2);

	//room info
	var room = {
		'users': [],
		'games': [],
		'rankings':[],
		'waiting': []
	};


	//user constructor
	function User(socket, username, rank){
		this.socketId = socket.id;
		this.username = username;
		this.socket   = socket;
		this.rank     = rank;
	}

	function pruneGame(game, games){
		for(var i=0; i<games.length; i++){
			if(games[i]==game){
				games.splice(i,1);
				i = games.length
			}
		}
	}

	//deleting a user from the room
	function pruneUser(socketId, users, waiting){
		//console.log('user pruned');
		for(var i=0; i<users.length; i++){
			if(users[i].socketId==socketId){
				users.splice(i,1);
				i=users.length;
			}
		}
		for(var i=0; i<waiting.length; i++){
			if(waiting[i].socketId==socketId){
				waiting.splice(i,1);
				i=users.length;
			}
		}
		checkWaiting(waiting);
	}

	//adding a user to the room
	function addUser(socket, username, users, waiting){
		var tempUser = new User(socket, username, users.length);
		users.push(tempUser);
		waiting.push(tempUser);
		checkWaiting(waiting);
	}

	function checkWaiting(waiting){
		for(var i=0; i<(waiting.length-1); i++){
			var opponent = checkForMatch(i, waiting);
			if(opponent){
				startGame(waiting[i], opponent);
				var opponentIndex = (waiting.indexOf(opponent)-1);
				waiting.splice(i,1);
				waiting.splice(opponentIndex,1);
				checkWaiting(waiting);
			}
		}
	}

	function checkForMatch(i, waiting){
		var current = waiting[i];
		i++;
		var baseReturn = null;
		for(a=i; a<waiting.length; a++){
			var temp = waiting[a];
			if((Math.abs(temp.rank-current.rank))<=2){
				return temp;
			}
		}
		return baseReturn;
	}

	function startGame(higher, lower){
		var clientHigher = {'username': higher.username,
												'rank': higher.rank
												}
		var clientLower = {'username': lower.username,
											 'rank': lower.rank 
											}
		var players = {'higher':clientHigher, 'lower':clientLower};
		higher.socket.emit('startingHigher', players);
		lower.socket.emit('startingLower', players);
		var tempGame = new loadGame.Game(higher, lower);
		room.games.push(tempGame);
	}

	function toAll(socket, toHappen, data){
		socket.emit(toHappen, data);
		socket.broadcast.emit(toHappen, data);
	}

	//Set all event listeners for each new socket
	sockets.on('connection', function(socket){

		socket.on('frmClient:login', function(username){
			addUser(socket, username, room.users, room.waiting);
		});
		
		socket.on('clientChoice', function(clientChoice){
			var gameStatus = loadGame.getGameResult(clientChoice, socket, room.games);
			console.log('e');
			console.log(gameStatus);
			if(gameStatus.finished){
				if(!gameStatus.tie){
					pruneGame(gameStatus.game, room.games);
				}
				else {
					pruneGame(gameStatus.game, room.games);
					gameStatus.game.higher.socket.emit('tie');
					gameStatus.game.lower.socket.emit('tie');
					startGame(gameStatus.game.higher, gameStatus.game.lower);
					
				}				
			}

		});

		socket.on('disconnect', function(){
			pruneUser(socket.id, room.users, room.waiting);
		});

		socket.emit('frmServer:login');
	});
};