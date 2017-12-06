import { Component, OnInit, ViewChild } from '@angular/core';
import { $WebSocket, WebSocketSendMode } from 'angular2-websocket/angular2-websocket';
import { WindowRefService } from '../services/window-ref.service';


const ws = new $WebSocket('wss://192.168.10.96:443/customserver');
let meVideo, otherVideo, txtUsername, btnRegister, txtPeer, btnCall;

console.log(ws);
// const ws = new $WebSocket('wss://192.168.1.33/customserver');
const rtcPeerOptions: any = {
  iceServers: [
    { urls: 'turn:128.199.205.47:8443', username: 'pakgon', credential: 'pakgon#pwd' }
  ]
};

let pc;
@Component({
  selector: 'app-demo-web-rtc',
  templateUrl: './demo-web-rtc.component.html'
})


export class DemoWebRtcComponent implements OnInit {

  @ViewChild('meVideo') meVideo: any;
  @ViewChild('otherVideo') otherVideo: any;


  _navigator = <any>navigator;
  localStream: any;
  remoteStream: any;
  pc;

  rtcPeerOptions: any = {
    iceServers: [
      { urls: 'turn:128.199.205.47:8443', username: 'pakgon', credential: 'pakgon#pwd' }
    ]
  };

  txtUsername: any;
  btnRegister: any;
  txtPeer: any;
  btnCall: any;


  constructor() {
    
  }

  ngOnInit() {

    this.txtUsername = document.getElementById('username');
    this.btnRegister = document.getElementById('btnRegister');
    this.txtPeer = document.getElementById('peer');
    this.btnCall = document.getElementById('btnCall');

    // console.log(window);
    this.wsOnOpen();
    this.wsOnMessage();
  }


  wsOnMessage() {
    const meVideo = this.meVideo.nativeElement;
    const nav = <any>navigator;
    nav.getUserMedia = (nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia);

    ws.onMessage((message) => {
      console.log('ws on message');
      console.log(message.data);
      const parsedMessage = JSON.parse(message.data);
      switch (parsedMessage.type) {
        case 'incoming_call':
          if (confirm('do you want to accept call from ' + parsedMessage.from + '?')) {

            pc = new RTCPeerConnection(this.rtcPeerOptions);

            console.log(pc);
            pc.onnegotiationneeded = function (evt) {
              console.log('pc on negotiation needed');
            };
            pc.onicecandidate = function (evt) {
              console.log('pc on ice candidate');
              console.log(evt.candidate);
              ws.send(JSON.stringify({
                type: 'icecandidate',
                username: this.txtUsername.value,
                iceCandidate: evt.candidate
              }));
            };
            pc.onconnecting = function (evt) {
              console.log('pc on connecting');
            };
            pc.onopen = function (evt) {
              console.log('pc on open');
            };
            pc.onaddstream = function (evt) {
              console.log('pc on add stream');
              this.otherVideo.src = evt.stream;
              this.remoteStream = evt.stream;
            };

            pc.setRemoteDescription(parsedMessage.offer);

            nav.getUserMedia({
              audio: true,
              video: true
            }, function (stream) {
              console.log('get user media success');
              meVideo.src = stream;
              console.log('xxx');
              this.localStream = stream;
              console.log(this.localStream);
              pc.addStream(stream);
              pc.createAnswer().then(function (desc) {
                console.log('create answer success');
                console.log(desc);

                pc.setLocalDescription(desc).then(function () {
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
          pc.setRemoteDescription(parsedMessage.answer);
          break;
        case 'on_icecandidate':
          pc.addIceCandidate(new RTCIceCandidate(parsedMessage.iceCandidate));
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
    console.log($("#username").val());
    ws.send(JSON.stringify({
      type: 'register',
      username: $("#username").val()
    }));
    $("#username").val('');
    return true;
  }

  memberCall() {
    console.log('member call');
    const meVideo = this.meVideo.nativeElement;
    const nav = <any>navigator;
    nav.getUserMedia = (nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia);

    nav.getUserMedia({
      audio: true,
      video: true
    }, function (stream) {
      console.log('get user media success');
      meVideo.srcObject = stream;
      this.localStream = stream;

      pc = new RTCPeerConnection(rtcPeerOptions);
      console.log(pc);
      pc.onnegotiationneeded = function (evt) {
        console.log('pc on negotiation needed');
      };
      pc.onicecandidate = function (evt) {
        console.log('pc on ice candidate');
        console.log(evt.candidate);
        ws.send(JSON.stringify({
          type: 'icecandidate',
          username: $('#username').val(),
          iceCandidate: evt.candidate
        }));
      };
      pc.onconnecting = function (evt) {
        console.log('pc on connecting');
      };
      pc.onopen = function (evt) {
        console.log('pc on open');
      };
      pc.onaddstream = function (evt) {
        console.log('pc on add stream');
        console.log(evt.stream);
        this.otherVideo.src = URL.createObjectURL(evt.stream);
        this.remoteStream = evt.stream;
      };

      pc.addStream(stream);
      pc.createOffer().then(function (desc) {
        console.log('create offer success');
        console.log(desc);

        pc.setLocalDescription(desc).then(function () {
          ws.send(JSON.stringify({
            type: 'call',
            from: $('#username').val(),
            to: $('#peer').val(),
            offer: desc
          }));
          console.log('set local description success');
        });
      });

    }, function (error) {
      console.log(error);
    });
  }
}
