import { Component, OnInit } from '@angular/core';
import {SharedDataService} from '../../../providers/shared-data/shared-data.service';
import {ModalController} from '@ionic/angular';
//import {FirebaseAuthentication} from '@ionic-native/firebase-authentication/ngx';
import {AuthenticationService} from '../../services/authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import {FirebaseService} from '../../services/firebase.service';
import {UserNamePage} from '../user-name/user-name.page';
import {LoadingService} from '../../../providers/loading/loading.service';


@Component({
  selector: 'app-login-email',
  templateUrl: './login-email.page.html',
  styleUrls: ['./login-email.page.scss'],
})
export class LoginEmailPage implements OnInit {

  constructor(
      public shared: SharedDataService,
      public modalCtrl: ModalController,
      private firebaseAuthentication: AngularFireAuth,
      public auth: AuthenticationService,
      private fbService: FirebaseService,
      private authServ: AuthenticationService,
      public loading: LoadingService,

  ) { }

  ngOnInit() {
  }

  disableButton() {

  }

  submit() {
   this.firebaseAuthentication.auth.signInWithEmailAndPassword(this.shared.userEmail, this.shared.userPassword).then( data => {
    // this.shared.customerToken = 'Hello';
    // this.auth.login(this.shared.customerToken);
     const userUid = this.firebaseAuthentication.auth.currentUser.uid;
   //  this.authServ.loginToAngularFire().then(resBol => {
       this.shared.userUid = userUid;
       console.log('UserUID from Initial Login   :' + this.shared.userUid);
       this.authServ.checkUserName(userUid).then(userName => {
         console.log('The username for this user   :' + userName);
         this.shared.userName = userName;
         this.shared.isUserNameSet = true;
         this.authServ.login('Hello');
         this.loading.hide();
         this.dismiss();
       }).catch(err => {
         console.log(err);
         this.loading.hide();
         this.dismiss().then(() => {
           this.goToUserNameModal();
         });
       });
   //  }).catch(err => { console.log(err);});
   /**  const sub = this.fbService.getUserName(userUid).valueChanges().subscribe( loginData => {
       sub.unsubscribe();
       if (loginData) {
         console.log('User Data Exists');

         this.dismiss();
       } else {
         this.dismiss().then( () => {
           this.goToUserNamePage();
         });
         console.log('User Data dont exist');
       }
     });*/
   }).catch( err => {
     console.log(err);
   });
  }
  // close modal
  dismiss() {
    return this.modalCtrl.dismiss();
  }

  async goToUserNameModal() {
    const modal = await this.modalCtrl.create({
      component: UserNamePage,
    });
    return await modal.present();
  }

  async goToUserNamePage() {
    const modal = await this.modalCtrl.create({
      component: UserNamePage,
    });
    return await modal.present();
  }

}
