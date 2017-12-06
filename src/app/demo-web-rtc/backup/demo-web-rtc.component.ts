import { Component, OnInit, ViewChild } from '@angular/core';
import { $WebSocket, WebSocketSendMode } from 'angular2-websocket/angular2-websocket';

const ws = new $WebSocket('wss://192.168.10.96:443/customserver');

@Component({
  selector: 'app-demo-web-rtc',
  templateUrl: './demo-web-rtc.component.html'
})
export class DemoWebRtcComponent implements OnInit {

  @ViewChild('meVideo') meVideo: any;
  @ViewChild('meVideo') otherVideo: any;
  _navigator = <any>navigator;
  localStream;

  rtcPeerOptions: any = {
    iceServers: [
      { urls: 'turn:128.199.205.47:8443', username: 'pakgon', credential: 'pakgon#pwd' }
    ]
  }

  // meVideo: any = document.getElementById('meVideo');
  // otherVideo: any = document.getElementById('otherVideo');
  txtUsername: any = document.getElementById('username');
  btnRegister: any = document.getElementById('btnRegister');
  txtPeer: any = document.getElementById('peer');
  btnCall: any = document.getElementById('btnCall');

  pc: any = null;

  constructor() {

  }

  ngOnInit() {

    const video = this.meVideo.nativeElement;
    this._navigator = <any>navigator;

    this._navigator.getUserMedia = (this._navigator.getUserMedia || this._navigator.webkitGetUserMedia || this._navigator.mozGetUserMedia || this._navigator.msGetUserMedia);

    this._navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.localStream = stream;
        video.src = window.URL.createObjectURL(stream);
        video.play();
      });

    // this.wsOnOpen();
    // this.wsOnMessage();
  }

  wsOnMessage() {
    ws.onMessage((message) => {
      console.log('ws on message');
      console.log(message.data);
      const parsedMessage = JSON.parse(message.data);
      switch (parsedMessage.type) {
        case 'incoming_call':
          if (confirm('do you want to accept call from ' + parsedMessage.from + '?')) {

            this.pc = new RTCPeerConnection(this.rtcPeerOptions);
            this.pc.onnegotiationneeded = function (evt) {
              console.log('pc on negotiation needed');
            };
            this.pc.onicecandidate = function (evt) {
              console.log('pc on ice candidate');
              console.log(evt.candidate);
              ws.send(JSON.stringify({
                type: 'icecandidate',
                username: this.txtUsername.value,
                iceCandidate: evt.candidate
              }));
            };
            this.pc.onconnecting = function (evt) {
              console.log('pc on connecting');
            };
            this.pc.onopen = function (evt) {
              console.log('pc on open');
            };
            this.pc.onaddstream = function (evt) {
              console.log('pc on add stream');
              this.otherVideo.srcObject = evt.stream;
              this.window.remoteStream = evt.stream;
            };

            this.pc.setRemoteDescription(parsedMessage.offer);

            navigator.getUserMedia({
              audio: false,
              video: true
            }, function (stream) {
              console.log('get user media success');
              this.meVideo.srcObject = stream;
              this.window.localStream = stream;
              this.pc.addStream(stream);
              this.pc.createAnswer().then(function (desc) {
                console.log('create answer success');
                console.log(desc);

                this.pc.setLocalDescription(desc).then(function () {
                  ws.send(JSON.stringify({
                    type: 'answer',
                    from: this.txtUsername.value,
                    to: parsedMessage.from,
                    answer: desc
                  }));
                  console.log('set local description success');
                });
              });
            }, function (error) {
              console.log(error);
            });
          }
          break;
        case 'call_response':
          this.pc.setRemoteDescription(parsedMessage.answer);
          break;
        case 'on_icecandidate':
          this.pc.addIceCandidate(new RTCIceCandidate(parsedMessage.iceCandidate));
          break;
        default:
          console.error('Unrecognized message', parsedMessage);
      }
    })
  }

  wsOnOpen() {
    ws.onOpen(() => {
      console.log('WS Open');
    });
    return true;
  }

  memberRegister() {
    console.log('memberRegister()');
    console.log(ws);
    // ws.send(JSON.stringify({
    //   type: 'register',
    //   username: this.txtUsername.value
    // }));
  }
}
