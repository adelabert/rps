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
		//re-rank those below after splicing a user 
		spliceRank: function(rankSpliced, users){
			for(var i=0; i<users.length; i++){
				if(users[i].rank > rankSpliced){
					users[i].rank--;
				}
			}
			console.log(rankSpliced);
		}
	}
};