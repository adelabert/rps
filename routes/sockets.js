//sockets.js
module.exports = function(sockets) {
	//include game module
	var loadGame = require('./middle/game.js')();

	//include two player game functions
	var twoPlayer = require('./middle/twoPlayer.js')();

	//load rock, paper, scissor
	var rps = new loadGame.Game('Rock, Paper, Scissors', 2);

	//room info
	var room = {
		'users': [],
		'games': [],
		'rankings':[],
		'waiting': []
	};

	function checkGame(game, games){
		if(game.higherChoice && game.lowerChoice){
			var gameResult = evaluateWinner(game.higherChoice, game.lowerChoice, game);
			if(!gameResult.tie){
				notifyResults(gameResult);
				pruneGame(game, games);				
			}
			else {
				
			}

		}
	}

	function notifyResults(gameResult){
		var toWinner = {
			'yourChoice': gameResult.winnerChoice,
			'theirChoice': gameResult.loserChoice
		};
		gameResult.winner.socket.emit('win', toWinner);
		console.log('notified winner');
		var toLoser = {
			'yourChoice': gameResult.loserChoice,
			'theirChoice': gameResult.winnerChoice
		};
		gameResult.loser.socket.emit('lose', toLoser);
		console.log('notified loser');
	}

	function GameResult(winner, loser, tie, winnerChoice, loserChoice){
		this.winner = winner;
		this.winnerChoice = winnerChoice;
		this.loser = loser;
		this.loserChoice = loserChoice;
		this.tie = tie;
	}

	function evaluateWinner(higherChoice, lowerChoice, game){
		if(higherChoice == lowerChoice){
			var curResult = new GameResult(null,null,false);
			return gameResult;
		} 
		else if (higherChoice == 'rock' ){
			if( lowerChoice == 'scissors' ){
				return (new GameResult(game.higher, game.lower, false, higherChoice, lowerChoice));
			}
			else {
				return (new GameResult(game.lower, game.higher, false, lowerChoice, higherChoice));
			}
		} 
		else if (higherChoice == 'paper' ){
			if( lowerChoice == 'rock' ){
				return (new GameResult(game.higher, game.lower, false, higherChoice, lowerChoice));
			}
			else {
				return (new GameResult(game.lower, game.higher, false, lowerChoice, higherChoice));
			}
		} else {
			if( lowerChoice == 'paper' ){
				return (new GameResult(game.higher, game.lower, false, higherChoice, lowerChoice));
			}
			else {
				return (new GameResult(game.lower, game.higher, false, lowerChoice, higherChoice));
			}
		}
	}

	//user constructor
	function User(socket, username, rank){
		this.socketId = socket.id;
		this.username = username;
		this.socket   = socket;
		this.rank     = rank;
	}

	//game constructor
	function Game(higher, lower){
		this.higher = higher;
		this.lower  = lower;
		this.higherChoice = null;
		this.lowerChoice = null;
	}

	function setGameResult(clientChoice, socket, games){
		for(var i=0; i<games.length; i++){
			if(games[i].higher.socketId == socket.id){
				games[i].higherChoice = clientChoice;
				checkGame(games[i], games);
				break;
			} 
			if(games[i].lower.socketId == socket.id) {
				games[i].lowerChoice = clientChoice;
				checkGame(games[i], games);
				break;
			} 
		}
	}

	function pruneGame(game, games){
		for(var i=0; i<games.length; i++){
			if(games[i]==game){
				games.splice(i,1);
				i = games.length;
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
		var tempGame = new Game(higher, lower);
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
			setGameResult(clientChoice, socket, room.games);
		});

		socket.on('disconnect', function(){
			pruneUser(socket.id, room.users, room.waiting);
		});

		socket.emit('frmServer:login');
	});
};