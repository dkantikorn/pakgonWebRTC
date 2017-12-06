var path = require('path');
var fs = require('fs');
var express = require('express');
var https = require('https');
var ws = require('ws');

var options =
	{
		key: fs.readFileSync('keys/server.key'),
		cert: fs.readFileSync('keys/server.crt')
	};

var app = express();
var server = https.createServer(options, app).listen(443, function () {
	console.log('custom server started');
});

var idCounter = 0;
var users = [];

function nextUniqueId() {
	idCounter++;
	return idCounter.toString();
}

var wss = new ws.Server({
	server: server,
	path: '/customserver'
});

wss.on('connection', function(ws) {
	var sessionId = nextUniqueId();
	var request = ws.upgradeReq;
	var response = {
		writeHead: {}
	};


	ws.on('message', function(message) {
		message = JSON.parse(message);
		console.log(message);
		switch (message.type) {
			case 'register':
				users[message.username] = {
					sessionId: sessionId,
					username: message.username,
					ws: ws
				};
				break;
			case 'call':
				users[message.from].offer = message.offer;
				users[message.from].peer = message.to;

				var callee = users[message.to];
				callee.ws.send(JSON.stringify({
					type: 'incoming_call',
					from: message.from,
					to: message.to,
					offer: message.offer
				}));
				break;
			case 'answer':
				users[message.from].answer = message.answer;
				users[message.from].peer = message.to;

				var caller = users[message.to];
				caller.ws.send(JSON.stringify({
					type: 'call_response',
					from: message.from,
					to: message.to,
					answer: message.answer
				}));
				break;
			case 'icecandidate':
				if (!users[message.username].iceCanditates) {
					users[message.username].iceCandidates = [];
				}

				if (message.iceCandidate) {
					users[message.username].iceCandidates.push(message.iceCandidate);

					if (users[message.username].peer) {
						for (var i = 0; i < users[message.username].iceCandidates.length; i++) {
							users[users[message.username].peer].ws.send(JSON.stringify({
								type: 'on_icecandidate',
								iceCandidate: users[message.username].iceCandidates[i]
							}));
							users[message.username].iceCandidates.shift();
						}
					}
				}
				break;
		}
	})
})
console.log(path.join(__dirname, 'static'));
app.use(express.static(path.join(__dirname, 'static')));