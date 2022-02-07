import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController} from '@ionic/angular';
import {FirebaseAuthentication} from '@ionic-native/firebase-authentication/ngx';
import {LoadingService} from '../../../providers/loading/loading.service';
import {SharedDataService} from '../../../providers/shared-data/shared-data.service';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../providers/config/config.service';
import {Storage} from '@ionic/storage';
import {AuthenticationService} from '../../services/authentication.service';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {FirebaseService} from '../../services/firebase.service';
import {UserNamePage} from '../user-name/user-name.page';
import {AngularFireAuth} from '@angular/fire/auth';

declare var cordova;
@Component({
  selector: 'app-login-phone',
  templateUrl: './login-phone.page.html',
  styleUrls: ['./login-phone.page.scss'],
})
export class LoginPhonePage implements OnInit {

    constructor(
      public modalCtrl: ModalController,
      private firebaseAuthentication: FirebaseAuthentication,
      public loading: LoadingService,
      public shared: SharedDataService,
      public toastController: ToastController,
      public http: HttpClient,
      public config: ConfigService,
      public storage: Storage,
      private authServ: AuthenticationService,
      private fireAna: AngularFireAnalytics,
      private fbService: FirebaseService,
      private afAuth: AngularFireAuth,
    ) {

    }
  phoneNumber = '';
  errorMessage = '';
  verID = '';
  aA = '';
  bB = '';
  cC = '';
  dD = '';
  eE = '';
  fF = '';
timeLeft = 50;
interval;
otpButtonText = 'Send';
otpButtonDisable = false;
verifyButtonDisable = false;
showVerificationFields = false;
username = '';
email = '';
password = '';
progressBarValue = 0;
awaitingSms = false;
credential: any;
//////////////////////////////////////////////////

///////////////////////////////////////////////////
initialLogin() {
this.username = this.phoneNumber.toString();
this.otpButtonDisable = true;
this.loading.show();
this.errorMessage = '';
const countryCode = '+92';
this.shared.phoneNumber = countryCode.concat(this.phoneNumber.toString().substring(1));
console.log(this.phoneNumber.toString());
this.firebaseAuthentication.verifyPhoneNumber(this.shared.phoneNumber.toString(), 60000).then(
    (res: any) => {
        this.showVerificationFields = true;
        this.startTimer();
        this.verifyButtonDisable = false;
        this.presentToast('OTP sent successfully!');
        this.verID = res;
        this.loading.hide();
        console.log(res);
    }
)
    .catch(
        (error: any) => {
          this.loading.hide();
          console.error(error);
          this.presentToast(error);
        }
    );
}

    /** Verification with google /*
     *
     */
    checkOTPNumbers() {
this.fireAna.logEvent('clicked_loginVerify');
this.progressBarValue =0;
const otpCode = this.aA + this.bB + this.cC + this.dD + this.eE + this.fF;
const regex = new RegExp('[0-9]');
    if (regex.test(this.aA) && regex.test(this.bB) && regex.test(this.cC)
    && regex.test(this.dD) && regex.test(this.eE) && regex.test(this.fF)) {
        console.log(otpCode);
        this.verifyButtonDisable = true;
        this.loading.show();
       // this.firebaseAuthentication.signOut().then(() => {

        this.firebaseAuthentication.signInWithVerificationId(this.verID, otpCode).then((res: any) => {
            this.dismiss();
            cordova.plugins.firebase.auth.getCurrentUser().then(userInfo => {
                this.authServ.loginToAngularFire().then(resBol => {
                    const userUid = userInfo.uid;
                    this.shared.userUid = userUid;
                    console.log('UserUID from Initial Login   :' + this.shared.userUid);
                    this.loading.hide();
                    /*   this.authServ.checkUserName(userUid).then(userName => {
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
                    }); */
                }).catch(err => { console.log(err);});
            });
        }).catch((error: any) => {
            this.loading.hide();
            console.log(error);
            this.presentToast('OTP code Wrong! Please enter correct OTP');
            this.verifyButtonDisable = false;
        });
   // });
    } else {
     this.presentToast('Please enter OTP Correctly!');
    }
}


startTimer() {
    this.timeLeft = 50;
    this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.otpButtonText = this.timeLeft.toString();
        } else {
            // this.timeLeft = 50;
            clearInterval(this.interval);
            this.otpButtonText = 'Resend OTP';
            this.otpButtonDisable = false;
            this.verifyButtonDisable = true;
            this.showVerificationFields = false;

        }
    }, 1000);
}

async presentToast(msg) {
    const toast = await this.toastController.create({
        message: msg,
        duration: 2000
    });
    toast.present();
}

moveFocus(event, nextElement, previousElement) {
   // console.log(event);
    const backInfo = event.detail.inputType;
    if (backInfo === 'deleteContentBackward') {
        //  previousElement.setFocus();
      } else {
          nextElement.setFocus();
      }
}

moveFocusFirst(event, nextElement) {
    //console.log(event);
    const backInfo = event.detail.inputType;
    if (backInfo === 'deleteContentBackward') {
    } else {
        nextElement.setFocus();
    }
    }
moveFocusLast(event, previousElement) {
  //  console.log(event);
    const backInfo = event.detail.inputType;
    if (backInfo === 'deleteContentBackward') {
      //  previousElement.setFocus();
    }
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

  ngOnInit() {
  }



}
