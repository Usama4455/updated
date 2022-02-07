import { Injectable } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {DataService} from './data.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  maxImageSelectCount = 6;
  constructor(
      private imagePicker: ImagePicker,
      private camera: Camera,
      private file: File,
      private dataService: DataService,
      private afStorage: AngularFireStorage,
      private shared: SharedDataService,
  ) { }

  cameraImageURI(): Promise<any> {
    return new Promise(resolve => {
      const options: CameraOptions = {
        quality: 25,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
      // Get picture from camera or gallery.
      this.camera.getPicture(options).then((imageData) => {
        // Process the returned imageURI.
        resolve(imageData);
        }).catch(err => {
          console.log(err);
        });
    });
  }

  imageURIFromAlbum(): Promise<any> {
    return new Promise(resolve => {
      // max images 6
    const options = {
      // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
      // selection of a single image, the plugin will return it.
      maximumImagesCount: this.maxImageSelectCount,

      // max width and height to allow the images to be.  Will keep aspect
      // ratio no matter what.  So if both are 800, the returned image
      // will be at most 800 pixels wide and 800 pixels tall.  If the width is
      // 800 and height 0 the image will be 800 pixels wide if the source
      // is at least that wide.
      width: 600,
      //height: 200,

      // quality of resized image, defaults to 100
      quality: 25,

      // output type, defaults to FILE_URIs.
      // available options are
      // window.imagePicker.OutputType.FILE_URI (0) or
      // window.imagePicker.OutputType.BASE64_STRING (1)
      //outputType: 1
    };

    let imageURI = [];
    this.imagePicker.getPictures(options).then((results) => {
      for (let i = 0; i < results.length; i++) {
        // this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
        imageURI.push(results[i]);
        console.log(results[i]);
      }
      //console.log(imageURI);
      resolve(imageURI);
    }, (err) => {
      alert(err);
    });
  });
  }


  imageFileToBlob(Uri): Promise<any> {
    return new Promise(resolve => {
      this.file.readAsArrayBuffer(this.dataService.fetchFilePathFromURI(Uri), this.dataService.fetchFileNameFromURI(Uri))
          .then((res) => {
            const blob = new Blob([res], {type: "image/jpeg"});
            resolve(blob);
          }).catch(err => {
            console.log(err);
      });
    });
  }

   uplpoadImageToRtdb(Uri, messageId): Promise<any> {
    return new Promise(resolve => {
      this.imageFileToBlob(Uri).then(imageBlob => {
        const fileRef = this.afStorage.ref('/images/' + messageId + '/' + this.generateFilename());
        fileRef.put(imageBlob).then( res => {
          fileRef.getDownloadURL().toPromise().then((url) => {
            console.log(url);
            resolve(url);
          }).catch(err => {console.log(err);});
        }).catch((err) => { console.log(err);});
        }).catch(err => {console.log(err);});
      }).catch(err => { console.log(err);});
   }

  async uplpoadMulImagesToRtdb(isAudio, audioUrl, audioFileName, UriArray: any [], messageId): Promise<any> {
    return new Promise( resolve => {
      const length = UriArray.length;
      let promises = [];
      let downImageUrlArray = [];
      let audioUploadUrl;
      if (isAudio) {
        promises.push(this.uploadAudioToStorage(audioUrl, audioFileName).then(res => {
          audioUploadUrl = res;
          console.log(audioUploadUrl);
        }));
      }

      for (let i = 0; i < length; i++) {
        promises.push(this.uplpoadImageToRtdb(UriArray[i], messageId).then(data => {
          downImageUrlArray.push(data);
        }).catch(err => {console.log(err);
        }));
      }
      Promise.all(promises).then(() => {
        console.log(downImageUrlArray);
        resolve(
            {
              image_url: downImageUrlArray,
              audio_url: audioUploadUrl,
            });
      });
    }).catch(err => { console.log(err);});
  }


  // Generate a random filename of length for the image to be uploaded
  generateFilename() {
    let length = 8;
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  async uploadAudioToStorage(audioFileUrl, fileName) {
    return new Promise(async resolve => {
     // const blob = await this.shared.getBlobFromFileEntry(audioFileUrl);
      this.audioFileToBlob(audioFileUrl).then(blob => {
        const filePath = '/audio/' + fileName;
        const fileRef = this.afStorage.ref(filePath);

        fileRef.put(blob).then( res => {
          fileRef.getDownloadURL().toPromise().then((url) => {
            console.log(url);
            resolve(url);
          });
        });
        // Firebase Storage
     /*   const task = this.afStorage.upload(filePath, blob);
        await task.snapshotChanges().toPromise();
        const audioUploadUrl = await fileRef.getDownloadURL().toPromise();
        console.log(audioUploadUrl);
        resolve(audioUploadUrl); */
      });
    });
  }

  audioFileToBlob(Uri): Promise<any> {
    return new Promise(resolve => {
      this.file.readAsArrayBuffer(this.dataService.fetchFilePathFromURI(Uri), this.dataService.fetchFileNameFromURI(Uri))
          .then((res) => {
            const blob = new Blob([res], {type: "audio/mp3"});
            resolve(blob);
          }).catch(err => {
        console.log(err);
      });
    });
  }
}
