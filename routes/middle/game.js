module.exports = function loadGame() {
	checkGame = function(game, games){
		if(game.higherChoice && game.lowerChoice){
			var gameResult = evaluateWinner(game.higherChoice, game.lowerChoice, game)
			if(!gameResult.tie){
				notifyWinLoss(gameResult);
				return gameResult;			
			}
			else {
				notifyTie(gameResult);
				return gameResult;
			}
		} else {
			return (new GameResult(null, null, true, null, null, game));
		}
	};

	notifyWinLoss = function(gameResult){
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
	};

	//game result constructor
	var GameResult = function(winner, loser, tie, winnerChoice, loserChoice, game){
		this.winner = winner;
		this.winnerChoice = winnerChoice;
		this.loser = loser;
		this.loserChoice = loserChoice;
		this.tie = tie;
		this.game = game;
	};

	evaluateWinner = function(higherChoice, lowerChoice, game){
		if(higherChoice == lowerChoice){
			return (new GameResult(null, null, true, null, null, game));
		} 
		else if (higherChoice == 'rock' ){
			if( lowerChoice == 'scissors' ){
				return (new GameResult(game.higher, game.lower, false, higherChoice, lowerChoice, game));
			}
			else {
				return (new GameResult(game.lower, game.higher, false, lowerChoice, higherChoice, game));
			}
		} 
		else if (higherChoice == 'paper' ){
			if( lowerChoice == 'rock' ){
				return (new GameResult(game.higher, game.lower, false, higherChoice, lowerChoice, game));
			}
			else {
				return (new GameResult(game.lower, game.higher, false, lowerChoice, higherChoice, game));
			}
		} 
		else {
			if( lowerChoice == 'paper' ){
				return (new GameResult(game.higher, game.lower, false, higherChoice, lowerChoice, game));
			}
			else {
				return (new GameResult(game.lower, game.higher, false, lowerChoice, higherChoice, game));
			}
		}
	};

	return {
		//Game Constructor
		gameMeta: function(title, numPlayers){
				this.title = title;
				this.numPlayers = numPlayers;
		},

		//game constructor
		Game: function(higher, lower){
			this.higher = higher;
			this.lower  = lower;
			this.higherChoice = null;
			this.lowerChoice = null;
		},

		getGameResult: function(clientChoice, socket, games){
			for(var i=0; i<games.length; i++){
				if(games[i].higher.socketId == socket.id){
					games[i].higherChoice = clientChoice;
					return checkGame(games[i], games);
				} 
				else if(games[i].lower.socketId == socket.id) {
					games[i].lowerChoice = clientChoice;
					return checkGame(games[i], games);
				} 
				else {
					//should never happen
					return (new GameResult(null, null, false, null, null, null));
				}
			}
		}
	}
};