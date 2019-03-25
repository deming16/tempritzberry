window.addEventListener('load', () => {
	// Put all client-side code here
	const messages = [];
	let username;

	const webrtc = new SimpleWebRTC({
		debug: true,
	});

	// Post Local Message
	const postMessage = (message) => {
		const chatMessage = {
		username,
		message,
		postedOn: new Date().toLocaleString('en-GB'),
		};
		// Send to all peers
		webrtc.sendToAll('chat', chatMessage);
		// Update messages locally
		messages.push(chatMessage);
		$('#post-message').val('');
		updateChatMessages();
	};

	// Register new Chat Room
	const createRoom = (roomName) => {
		// eslint-disable-next-line no-console
		console.info(`Creating new room: ${roomName}`);
		webrtc.createRoom(roomName, (err, name) => {
		formEl.form('clear');
		showChatRoom(name);
		postMessage(`${username} created chatroom`);
		});
	};

	// Join existing Chat Room
	const joinRoom = (roomName) => {
		// eslint-disable-next-line no-console
		console.log(`Joining Room: ${roomName}`);
		webrtc.joinRoom(roomName);
		showChatRoom(roomName);
		postMessage(`${username} joined chatroom`);
	};

	// Receive message from remote user
	webrtc.connection.on('message', (data) => {
		if (data.type === 'chat') {
		const message = data.payload;
		messages.push(message);
		updateChatMessages();
		}
	});

});







