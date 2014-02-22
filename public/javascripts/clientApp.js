var socket = io.connect(window.document.host);

socket.on('frmServer:login', function(){
	var username = prompt('Pick a username: ');
	socket.emit('frmClient:login', username);
});

socket.on('startingHigher', function(players){
	$('#board').toggle();
	$('.choices').toggle();
	//alert('starting a game with a lower player');
});
socket.on('startingLower', function(players){
	$('#board').toggle();
	$('.choices').toggle();
});

socket.on('opponentChoice', function(opponentChoice, result){
	var opponentHTML = 'they choice ' + opponentChoice + '';
	$('#opponentChoice').html(opponentHTML);
	$('#resultMessage').html(result);
});

socket.on('win', function(toWinner){
	var message = 'You chose ' + toWinner.yourChoice + 
								', they chose ' + toWinner.theirChoice + 
								'. YOU WIN!';
	$('#resultMessage').html(message);
});

socket.on('lose', function(toLoser){
	var message = 'You chose ' + toLoser.yourChoice +
								', they chose ' + toLoser.theirChoice +
								'. YOU LOSE!';
	$('#resultMessage').html(message);
});

socket.on('tie', function(){
	alert("it's a tie!");
});

$(".choice").on("click", function(){
	var clientSelectedHTML = "You chose " + this.dataset.choice + "";
	$("#clientChoice").html(clientSelectedHTML);
	var clientChoice = this.dataset.choice;
	socket.emit("clientChoice", clientChoice);
});

