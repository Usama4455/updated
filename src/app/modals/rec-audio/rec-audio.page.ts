import { Component, OnInit } from '@angular/core';
import {File, FileEntry} from '@ionic-native/file/ngx';
import {Media, MediaObject} from '@ionic-native/media/ngx';
import {LoadingService} from '../../../providers/loading/loading.service';
import {SharedDataService} from '../../../providers/shared-data/shared-data.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-rec-audio',
  templateUrl: './rec-audio.page.html',
  styleUrls: ['./rec-audio.page.scss'],
})
export class RecAudioPage implements OnInit {
  audioExtension = '.mp3';
  audioFile: FileEntry;
  audioMediaSrc = '';
  audioMedia: MediaObject;

  constructor(
      public file: File,
      private media: Media,
      public loading: LoadingService,
      public shared: SharedDataService,
      public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  //  this.firstTimeAudio = this.fireStoreData.firstTimeAudio;
  //  this.docID = this.fireStoreData.docID;
  //  this.prevAudioUrl = this.fireStoreData.prevAudioUrl;
    this.startRecordAudio();
  }

  async startRecordAudio() {
    let path;
    const date = new Date().getTime();
    const name = 'record_' + date + this.audioExtension;
    path = this.file.dataDirectory;
    this.audioFile = await this.file.createFile(path, name, true);
    this.audioMediaSrc = this.audioFile.nativeURL.replace(/^file:[\/]+/, '');
    this.audioMedia = this.media.create(this.audioFile.nativeURL);
    this.audioMedia.startRecord();
    this.mediaSubscription();
  }

  async stopRecordAudio() {
    if (!this.audioFile) {return;}
    try {
      this.audioMedia.stopRecord();
      await this.shared.delay(200);
    } finally {

    }
  }

  stopClicked() {
    this.loading.show();
    this.stopRecordAudio().then(() => {
      this.loading.hide();
      this.modalCtrl.dismiss(this.audioFile).then(() => {
        this.audioFile = null;
      });
    }).catch(err => {
      console.log(err);
    });
  }

  mediaSubscription() {
    this.audioMedia.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes

    this.audioMedia.onSuccess.subscribe(() => console.log('Action is successful'));

    this.audioMedia.onError.subscribe(error => console.log('Error!', error));
  }

}
