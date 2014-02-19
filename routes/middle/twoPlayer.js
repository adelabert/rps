module.exports = function twoPlayer() {
	return {
		//adjust ranks for winner and loser of game
		winLossRank: function(winner, loser, users){
			if(winner.rank > loser.rank){
				return;
			} else {
				loser.rank = winner.rank;
				winer.rank = loser.rank;
				return;
			}
		},
	}
};