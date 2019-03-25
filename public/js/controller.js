window.addEventListener('load', () => {
	var username;
	
	const webrtc = new SimpleWebRTC({
		debug: false,
	});

	// Send Control Message
	const postControlMessage = (message, speed) => {
		const controlMsg = {
			username,
			message,
			speed,
		};
		// Send to all peers
		webrtc.sendToAll('control', controlMsg);
	};

	// Send New Player Message
	const postNewPlayerMessage = (username) => {
		// console.log('New player message sent');
		const newPlayerMsg = {
			username,
		};
		// Send to all peers
		webrtc.sendToAll('newPlayer', newPlayerMsg);
	}

	// Receieve message from shared screen
	webrtc.connection.on('message', (data) => {
		if (data.type === 'backgroundColor') {
			const message = data.payload;
			$('#controllerBody').css('background-color',message.backgroundColor);
		}
	});

	// Join existing Chat Room
	const joinRoom = (roomName, username) => {
		// eslint-disable-next-line no-console
		// console.log(`Joining Room: ${roomName}`);
		webrtc.joinRoom(roomName);
		webrtc.on('joinedRoom', function(roomName) {
			postNewPlayerMessage(username);
		});
		// console.log('Joined room');
	};

	// Join Game Button Handler
	$('#joinGame').on('click', (event) => {
		let gamePin = $('#gamePin').val();
		username = $('#userName').val();
		joinRoom(gamePin, username);

		$('#userName').remove();
		$('#gamePin').remove();
		$('#joinGame').remove();
		$('#backButton').remove();
		$('#controls').show();

		window.addEventListener('deviceorientation', deviceOrientationHandler, false);
	});

	// Left Button Handler
	$('#leftButton').on({
		mousedown : function () {
			interval = window.setInterval(function(){
				postControlMessage('l', 0);
			}, 10);
		},
		mouseup : function () {
			window.clearInterval(interval);
		}
	});

	$('#rightButton').on({
		mousedown : function () {
			interval = window.setInterval(function(){
				postControlMessage('r', 0);
			}, 10);
		},
		mouseup : function () {
			window.clearInterval(interval);
		}
	});

	function deviceOrientationHandler (eventData) {
		var tiltLR = eventData.gamma;
		var direction;
		if (tiltLR < 0) {
			direction = 'l';
			tiltLR = tiltLR * -1;
		} else {
			direction = 'r';
		}

		if(tiltLR > 80) {
			speed = 4;
		} else if (tiltLR > 60 ) {
			speed = 3;
		} else if (tiltLR > 40) {
			speed = 2;
		} else if (tiltLR > 20) {
			speed = 1;
		} else {
			speed = 0;
		}

		postControlMessage(direction, speed);
	}

	// Right Button Handler
	// $('#rightButton').on('click', (event) => {
	// 	postControlMessage('r');
	// });
});










