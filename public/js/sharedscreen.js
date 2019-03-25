window.addEventListener('load', () => {
	var gameInstance;
	var usernameDict = {};
	var playerId = 0;
	var maxNoOfPlayers = 4;

	let gamePin = makeid();
	$('#gamePin').text(gamePin);

	const webrtc = new SimpleWebRTC({
		debug: false,
	});

	// Register new Chat Room
	const createRoom = (roomName) => {
		// console.info(`Creating new room: ${roomName}`);
		webrtc.createRoom(roomName, (err, name) => {
			// console.info('New room created');
		});
	};

	// Send Control Message
	const postBackgroundColorMessage = (color) => {
		const controlMsg = {
			color,
		};
		// Send to all peers
		// Send to all peers
		webrtc.on('createdPeer', (peer) => {
			peer.send('backgroundColor', controlMsg);
		});
	};

	// Receieve message from remote user
	webrtc.connection.on('message', (data) => {	
		if (data.type === 'control') {
			const controlMsg = data.payload;
			let username = controlMsg.username;
			let playerId = usernameDict[username];
			let playerMove = controlMsg.message;
			let playerSpeed = controlMsg.speed;
			var move = playerId + playerMove + playerSpeed + "";
			gameInstance.SendMessage("GameManager", "handleKeyPress", move);
			
		} else if (data.type === 'newPlayer') {
			// console.info("New user")
			const newPlayerMsg = data.payload;
			let username = newPlayerMsg.username;
			$('#usersInRoom').append(username+'\n');
			usernameDict[username] = playerId;
			// switch(playerId) {
			// 	case 0:
			// 		postBackgroundColorMessage('#FF0000');
			// 		break;
			// 	case 1:
			// 		postBackgroundColorMessage('#FFFF00');
			// 		break;
			// 	case 2:
			// 		postBackgroundColorMessage('#00FF00');
			// 		break;
			// 	case 3:
			// 		postBackgroundColorMessage('#00FFFF');
			// 		break;
			// 	default:
			// 		log.info("Invalid player ID");
			// }
			console.log(usernameDict);
			playerId++;
			// console.info('New PlayerID: ' + usernameDict[username] + ', Username: ' + username);
			if (playerId === maxNoOfPlayers) {
				$('#info').remove();
				$('#game').append('<div class="webgl-content">'+
					'<div id="gameContainer" style="width: 1960px; height: 600px">'+
					'</div><div class="footer"><div class="webgl-logo"></div>' +
					'<div class="fullscreen" onclick="gameInstance.SetFullscreen(1)"></div>' +
					'<div class="title">New Year Pong</div></div></div>');
				gameInstance = UnityLoader.instantiate("gameContainer", "Build/new year pong.json", {onProgress: UnityProgress});
				// console.info('All players arrived');
			}
		}
	});

	createRoom(gamePin);
});

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
	text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}
