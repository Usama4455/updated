import {Component, Input, OnInit} from '@angular/core';
import {NavigationExtras} from '@angular/router';
import {NavController} from '@ionic/angular';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-timeline-msg',
  templateUrl: './timeline-msg.component.html',
  styleUrls: ['./timeline-msg.component.scss'],
})
export class TimelineMsgComponent implements OnInit {
  @Input('timelineMsg') timelineMsg;
timeElapsed: string;
numOfImages = 0;
isAudio = false;
audioUrl = '';
audio = new Audio();
audioPlaying = false;
  username;
  constructor(
      private navCtrl: NavController,
      private photoViewer: PhotoViewer,
  ) { }

  ngOnInit() {

    this.username = this.capitalize(this.timelineMsg.username);

    if (this.timelineMsg.hasOwnProperty('audio')) {
      if (this.timelineMsg.audio == null) {
        this.isAudio = false;
      } else {
        this.isAudio = true;
        this.audioUrl = this.timelineMsg.audio;
        //let audioLocal = new Audio(this.audioUrl);
        this.audio.src = this.audioUrl;
        this.audio.load();
      }
      this.numOfImages = this.timelineMsg.images.length;
    } else {
      this.isAudio = false;
    }

    if (this.timelineMsg.hasOwnProperty('images')) {
      this.numOfImages = this.timelineMsg.images.length;
    } else {
      this.numOfImages = 0;
    }
    const currentTIme = Date.now() / 1000;
    const msgTime = this.timelineMsg.timestamp.seconds;
    const diff = currentTIme - msgTime;
    const sec = Math.round(diff);
    const min = Math.round(diff / (60));
    const hour = Math.round(diff / (60 * 60 ));
    const days = Math.round(diff / (60 * 60 * 24));
    const years = Math.round(diff / (60 * 60 * 24 * 365));
    if (sec <= 59) {
      this.timeElapsed = sec + ' Secs ago';
    } else if (min <= 59) {
      this.timeElapsed = min + ' mins ago';
    } else if (hour <= 23) {
      this.timeElapsed = hour + ' hours ago';
    } else if (days <= 364) {
      this.timeElapsed = days + ' days ago';
    } else if (years <= 1000) {
      this.timeElapsed = years + ' years ago';
    } else {
      this.timeElapsed = '';
    }

  }

  getFirstLetter() {
    return this.timelineMsg.username.charAt(0).toLocaleUpperCase();
  }

  goToMessages(m) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        request: m,
      }
    };
    this.navCtrl.navigateForward('messages', navigationExtras);
    console.log(m);
  }

  showPhoto(url) {
    this.photoViewer.show(url);
  }

  capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  playAudio() {
    if (this.audioPlaying) {
      this.audioPlaying = false;
      this.audio.pause();
    } else {
      this.audioPlaying = true;
      this.audio.play();
    }
  }

}
