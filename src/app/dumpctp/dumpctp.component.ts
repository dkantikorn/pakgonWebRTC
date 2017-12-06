import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dumpctp',
  templateUrl: './dumpctp.component.html',
  styleUrls: ['./dumpctp.component.css']
})
export class DumpctpComponent implements OnInit {

  @ViewChild('meVideo') meVideo: any;

  _navigator = <any>navigator;
  localStream;

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

  }

  stopStream() {
    const tracks = this.localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
  }

}
