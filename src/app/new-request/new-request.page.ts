import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import {ImageService} from '../services/image.service';
import {AlertController, ModalController, NavController, ToastController} from '@ionic/angular';
import {File, FileEntry} from '@ionic-native/file/ngx';
import {FirebaseService} from '../services/firebase.service';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {LoadingService} from '../../providers/loading/loading.service';
import {Storage} from '@ionic/storage';
import {LoginEmailPage} from '../modals/login-email/login-email.page';
import {RecAudioPage} from '../modals/rec-audio/rec-audio.page';
import {Media, MediaObject} from '@ionic-native/media/ngx';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.page.html',
  styleUrls: ['./new-request.page.scss'],
})
export class NewRequestPage implements OnInit {
  message = '';
  public searchTerm: string = "";
  public items: any;
  showList = false;
  imageResponse: any;
  options: any;
  imageURIGlobal = [];
  postButtonDisable = true;
  city = '';
  private sender: string;
  audioFile: FileEntry;
  audioFileUrl;
  audioFileName;

  isAudio = false;
  audioMedia: MediaObject;


  constructor(
      private dataService: DataService,
      private imageService: ImageService,
      public alertController: AlertController,
      private file: File,
      private fbService: FirebaseService,
      public shared: SharedDataService,
      public loading: LoadingService,
      private toastController: ToastController,
      private navController: NavController,
      public storage: Storage,
      public modalCtrl: ModalController,
      public media: Media,

  ) {

  }


  proceedToCamera() {
  this.imageService.cameraImageURI().then(imageURI => {
    console.log(imageURI);
    const count = this.imageURIGlobal.length;
    if (count < this.imageService.maxImageSelectCount) {
        this.imageURIGlobal.push(imageURI);
    } else {
      this.presentAlert();
    }
  }).catch(err => {
    console.log(err);
  });
  }

  proceedToAlbum() {
    this.imageService.imageURIFromAlbum().then((imageURIArray) => {
      console.log(imageURIArray);
      const count = this.imageURIGlobal.length;
      if (count < this.imageService.maxImageSelectCount) {
        for (let i = 0; i < imageURIArray.length; i++) {
          this.imageURIGlobal.push(imageURIArray[i]);
        }
      } else {
       this.presentAlert();
      }
      console.log(this.imageURIGlobal);
    }).catch(err => {
      console.log(err);
    });
  }


  setFilteredItems() {
    this.items = this.dataService.filterItems(this.searchTerm);
  }

  clickItem(index) {
    this.searchTerm = this.items[index].name;
    console.log(index);
    console.log(this.searchTerm);
    console.log('city   :' + this.city);
    this.city = this.searchTerm.toString();
  }

  searchBarFocus() {
    this.showList = true;
  }

  searchBarCancel() {
    this.searchTerm = '';
    this.showList = false;
    this.city = '';
  }

  searchBarClear() {
    this.searchTerm = '';
    this.showList = false;
    this.city = '';
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message: 'Please only select maximum of 6 images',
      buttons: ['OK']
    });

    await alert.present();
  }
  ngOnInit() {
    this.setFilteredItems();
  }

ionViewDidLeave() {
  const count = this.imageURIGlobal.length;
    for (let i = 0; i < count; i++) {
      const filePath = this.dataService.fetchFilePathFromURI(this.imageURIGlobal[i]);
      const fileName = this.dataService.fetchFileNameFromURI(this.imageURIGlobal[i]);
      this.file.removeFile(filePath, fileName).then( msg => {
        console.log(msg);
      });
    }
  }

  deleteImage(index) {
    if (index > -1) {
      this.imageURIGlobal.splice(index, 1);
    }
    console.log(this.imageURIGlobal);
  }

  postSubmit() {
    if (this.imageURIGlobal.length === 0) {return this.imageErrorToast();}
    this.loading.show();
    const timeStamp = this.fbService.getTimeStampFb();
    console.log('Time Stamp    :'  + timeStamp);
    this.fbService.generateId().then((reqId) => {
      this.imageService.uplpoadMulImagesToRtdb(this.isAudio, this.audioFileUrl, this.audioFileName, this.imageURIGlobal, reqId).then(res => {
        console.log(res);
        let imageUrl = [];
        let audioUrl = '';
        imageUrl = res.image_url;
        if (typeof res.audio_url === 'undefined') {
          audioUrl = null;
        } else {
          audioUrl = res.audio_url;
        }
        const request = {
         // date: new Date().toString(),
          ownerId: this.shared.userUid,
          username: this.shared.userName,
          city: this.city,
          message: this.message,
          images: imageUrl,
          audio: audioUrl,
          timestamp: timeStamp,
          reqId: reqId,
        };

          this.fbService.uploadRequestCommon(reqId, request).then(dataA => {
            this.fbService.updateUsersRequestCommon(this.shared.userUid, reqId, request).then(() => {
             // console.log(dataA);
              const dataSub = {
                reqId: reqId,
                city: this.city,
                images: imageUrl,
                message: this.message,
                ownerId: this.shared.userUid,
                audio: audioUrl,
                timestamp: this.fbService.getTimeStampRtdb(),
                username: this.shared.userName,
              };
              this.fbService.updateMsgSubscription(this.shared.userUid, reqId, dataSub).then(() => {
                let data = [];
                console.log('Message Subscription Updated  :');
                  const name = 'msg_' + reqId + '_last';
                  const timeStampMsg = 0;
                  this.storage.set( name, timeStampMsg);
                  console.log(name + '  Set');

              });
              this.loading.hide();
              this.successToast().then(() => {
                this.navController.navigateRoot('/tabs');
              });

            }).catch(err => {console.log(err); this.loading.hide();});
          }).catch(err => {console.log(err); this.loading.hide();});

      }).catch(err => {
        console.log(err);
        this.loading.hide();
      });
    }).catch(err => {console.log(err);this.loading.hide();
    });
  }


  async successToast() {
    const toast = await this.toastController.create({
      message: 'Request Posted Successfully',
      duration: 1000
    });
    toast.present();
  }

    async recordAudio() {
      const modal = await this.modalCtrl.create({
        component: RecAudioPage,
        cssClass: 'my-custom-modal-css',
        componentProps: { audioFile: this.audioFile },
      });
      modal.onDidDismiss()
          .then((data) => {
            const audioFile = data['audioFile']; // Here's your selected user!
            this.audioFile = audioFile;
            this.audioFileUrl =  data.data.nativeURL;
            console.log(data);
            this.audioFileName = data.data.name;
            const extension = this.audioFileName.substring(this.audioFileName.lastIndexOf('.') + 1);
            if (extension === 'mp3') {
              this.isAudio = true;
              this.audioMedia = this.media.create(this.audioFileUrl);
            } else {
              this.isAudio = false;
            }
          });
      return await modal.present();
    }

    playAudio() {
    if (this.isAudio) {
      this.audioMedia.play();
    }
    }

  stopAudio() {
    if (this.isAudio) {
      this.audioMedia.stop();
    }
  }

  deleteAudio() {
    this.isAudio = false;
    this.audioMedia = null;
  }

  async imageErrorToast() {
    const toast = await this.toastController.create({
      message: 'Please upload at least one image',
      duration: 1000
    });
    toast.present();
  }


}
