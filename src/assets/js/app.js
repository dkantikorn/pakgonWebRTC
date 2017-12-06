// var rtcPeerOptions = {
//     iceServers: [
//         { urls: 'turn:128.199.205.47:8443', username: 'pakgon', credential: 'pakgon#pwd' }
//     ]
// };

// var meVideo = document.getElementById('meVideo');
// var otherVideo = document.getElementById('otherVideo');
// var txtUsername = document.getElementById('username');
// var btnRegister = document.getElementById('btnRegister');
// var txtPeer = document.getElementById('peer');
// var btnCall = document.getElementById('btnCall');

// var pc;

// btnRegister.onclick = function (evt) {
//     ws.send(JSON.stringify({
//         type: 'register',
//         username: txtUsername.value
//     }));
// };

// btnCall.onclick = function (evt) {
//     navigator.getUserMedia({
//         audio: false,
//         video: true
//     }, function (stream) {
//         console.log('get user media success');
//         meVideo.srcObject = stream;
//         window.localStream = stream;

//         pc = new RTCPeerConnection(rtcPeerOptions);
//         pc.onnegotiationneeded = function (evt) {
//             console.log('pc on negotiation needed');
//         };
//         pc.onicecandidate = function (evt) {
//             console.log('pc on ice candidate');
//             console.log(evt.candidate);
//             ws.send(JSON.stringify({
//                 type: 'icecandidate',
//                 username: txtUsername.value,
//                 iceCandidate: evt.candidate
//             }));
//         };
//         pc.onconnecting = function (evt) {
//             console.log('pc on connecting');
//         };
//         pc.onopen = function (evt) {
//             console.log('pc on open');
//         };
//         pc.onaddstream = function (evt) {
//             console.log('pc on add stream');
//             console.log(evt.stream);
//             otherVideo.src = URL.createObjectURL(evt.stream);
//             window.remoteStream = evt.stream;
//         };

//         pc.addStream(stream);
//         pc.createOffer().then(function (desc) {
//             console.log('create offer success');
//             console.log(desc);

//             pc.setLocalDescription(desc).then(function () {
//                 ws.send(JSON.stringify({
//                     type: 'call',
//                     from: txtUsername.value,
//                     to: txtPeer.value,
//                     offer: desc
//                 }));
//                 console.log('set local description success');
//             });
//         });

//     }, function (error) {
//         console.log(error);
//     });
// };


// // var ws = new WebSocket('wss://192.168.10.103:443/customserver');
// var ws = new WebSocket('wss://192.168.10.96:8443/customserver');
// ws.onopen = function () {
//     console.log('ws on open');
// };

// ws.onmessage = function (message) {
//     console.log('ws on message');
//     console.log(message.data);
//     var parsedMessage = JSON.parse(message.data);
//     switch (parsedMessage.type) {
//         case 'incoming_call':
//             if (confirm('do you want to accept call from ' + parsedMessage.from + '?')) {

//                 pc = new RTCPeerConnection(rtcPeerOptions);
//                 pc.onnegotiationneeded = function (evt) {
//                     console.log('pc on negotiation needed');
//                 };
//                 pc.onicecandidate = function (evt) {
//                     console.log('pc on ice candidate');
//                     console.log(evt.candidate);
//                     ws.send(JSON.stringify({
//                         type: 'icecandidate',
//                         username: txtUsername.value,
//                         iceCandidate: evt.candidate
//                     }));
//                 };
//                 pc.onconnecting = function (evt) {
//                     console.log('pc on connecting');
//                 };
//                 pc.onopen = function (evt) {
//                     console.log('pc on open');
//                 };
//                 pc.onaddstream = function (evt) {
//                     console.log('pc on add stream');
//                     otherVideo.srcObject = evt.stream;
//                     window.remoteStream = evt.stream;
//                 };

//                 pc.setRemoteDescription(parsedMessage.offer);

//                 navigator.getUserMedia({
//                     audio: false,
//                     video: true
//                 }, function (stream) {
//                     console.log('get user media success');
//                     meVideo.srcObject = stream;
//                     window.localStream = stream;
//                     pc.addStream(stream);
//                     pc.createAnswer().then(function (desc) {
//                         console.log('create answer success');
//                         console.log(desc);

//                         pc.setLocalDescription(desc).then(function () {
//                             ws.send(JSON.stringify({
//                                 type: 'answer',
//                                 from: txtUsername.value,
//                                 to: parsedMessage.from,
//                                 answer: desc
//                             }));
//                             console.log('set local description success');
//                         });
//                     });
//                 }, function (error) {
//                     console.log(error);
//                 });
//             }
//             break;
//         case 'call_response':
//             pc.setRemoteDescription(parsedMessage.answer);
//             break;
//         case 'on_icecandidate':
//             pc.addIceCandidate(new RTCIceCandidate(parsedMessage.iceCandidate));
//             break;
//         default:
//             console.error('Unrecognized message', parsedMessage);
//     }
// };
// ws.onclose = function () {
//     console.log('ws on close');
// }
// window.onbeforeunload = function () {
//     pc.close();
//     ws.close();
// }