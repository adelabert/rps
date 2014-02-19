var socket = io.connect('http://localhost:3000');

socket.on('frmServer:login', function(){
	var username = prompt('Pick a username: ');
	socket.emit('frmClient:login', username);
});

socket.on('frmServer:refreshRoom', function(room){
	renderRoom(room);
});


function renderRoom(room){
	renderUsers(room.users);
	//renderTables(room);
}


function renderUsers(users){
	var usersHTML = '';
	function scriptLine(element, index, array){
		var temp = '';
		temp += '' + index + ': ' + element.username + '</br>'	;
		usersHTML += temp;
	}
	users.forEach(scriptLine);
	$('#userList').html(usersHTML);
}

/*
function renderTables(room){
	var tablesHTML = '';
	for(var i=0; i<room.tables.length; i++){
		var tempHTML = scriptTable(i, room.users, room.waitList);
		tablesHTML += tempHTML;
	}		
	$('#room').html(tablesHTML);
}


function scriptTable(high, low, waiting){
	var highChairHTML = scriptChair('high', high);
	var lowChairHTML = scriptChair('low', low);
	var waitChairHTML = srciptChair('wait', wait);
	var tableHTML = highChairHTML + lowChairHTML + waitChairHTML;
	return tableHTML;
}

 
function scriptChair(chairType, playerName){
	var temp = '<div class="chair ' + chairType
						 + '" data-player="' + playerName
						 + '" data-type="' + chairType
						 + '">';
	 temp += playerName;
	 temp += '</div>';
	return temp;
}*/