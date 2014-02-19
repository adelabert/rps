module.exports = function loadGame() {
	return {
		//Game Constructor
		Game: function(title, numPlayers){
			this.title = title;
			this.numPlayers = numPlayers;
		}
	}
};

