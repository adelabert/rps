

var socket = io.connect(document.window.host);

socket.on('frmServer:login', function(){
	var username = prompt('Pick a username: ');
	socket.emit('frmClient:login', username);
});

socket.on('frmServer:refreshRoom', function(room){
	renderRoom(room);
});


function renderRoom(room){
	renderUsers(room.users);
	renderTables(room);
}

function renderUsers(users){
	var temp = '';
	for(var i=0; i<users.length; i++){
		temp += users[i].username;
		temp += ': ';
		temp += users[i].rank;
		temp += '</br>';
	}
	$('#userList').html(temp);
}


function renderTables(room){
	var tablesHTML = '';
	for(var i=0; i<room.tables.length; i++){
		var tempHTML = scriptTable(i, room.users, room.waitList);
		tablesHTML += tempHTML;
	}		
	$('#room').html(tablesHTML);
}




function scriptTable(i, users, waitList){
	var tempPlayerRank = ((i*2)+1);
	var highChairPlayer = selectForRank(users, tempPlayerRank);
	var highChairHTML = scriptChair('high', highChairPlayer.username);

	var tempPlayerRank1 = ((i*2)+2);
	var lowChairPlayer = selectForRank(users, tempPlayerRank1);
	var lowChairHTML = scriptChair('low', lowChairPlayer.username);

	var tableHTML = highChairHTML + lowChairHTML;
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
}

function selectForRank(userArray, rank){
	for(var i=0; i<userArray.length; i++){
		if(userArray[i].rank == rank){
			return userArray[i];
		}
	}	
}








