import { Component, OnInit } from '@angular/core';
import {SharedDataService} from '../../../providers/shared-data/shared-data.service';
import {ModalController, NavController, ToastController} from '@ionic/angular';
import {FirebaseService} from '../../services/firebase.service';
import {LoadingService} from '../../../providers/loading/loading.service';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.page.html',
  styleUrls: ['./user-name.page.scss'],
})
export class UserNamePage implements OnInit {
disableSubmitButton = false;

  constructor(
      public shared: SharedDataService,
      public modalCtrl: ModalController,
      public fbService: FirebaseService,
      public loading: LoadingService,
      public authServ: AuthenticationService,
      private toastController: ToastController,
      private navCtrl: NavController,

  ) { }

  ngOnInit() {
  }

  // close modal
  dismiss() {
    console.log('User name set   :'  + this.shared.isUserNameSet);
    if (this.shared.isUserNameSet === false) {
      this.shared.showAlertWithTitle('It is mandatory to enter the user name', 'Warning');
    } else {
      this.modalCtrl.dismiss();
    }
  }


  submit() {
    this.loading.show();
    this.disableSubmitButton = true;
    const userName = this.shared.userName.toLowerCase();
    const sub = this.fbService.checkUserName(userName).valueChanges().subscribe( data => {
     sub.unsubscribe();
     if (data.length === 0) {
       const userData = {
         uid : this.shared.userUid,
         username: userName,
       };
       this.fbService.setUserName(userData).then(() => {
         this.shared.isUserNameSet = true;
         this.loading.hide();
         this.dismiss();
         this.authServ.login('Hello');
         //this.navCtrl.navigateRoot('user-name');
       });
     } else {
       this.disableSubmitButton = false;
       this.loading.hide();
       this.msgToast('Username ' + this.shared.userName + ' is in use!');
     }
    });
  }

  async msgToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000
    });
    toast.present();
  }

}
