import { Component } from '@angular/core';

import {Platform, NavController, ModalController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';


import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { LoadingService } from 'src/providers/loading/loading.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import {Router } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import {AuthenticationService} from './services/authentication.service';
import { CodePush } from '@ionic-native/code-push/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {environment} from '../environments/environment';
import {EventServiceService} from './services/event-service.service';
import {LoginPhonePage} from './modals/login-phone/login-phone.page';
import { NgZone } from '@angular/core';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import { AngularFireAuth } from '@angular/fire/auth';
import {FirebaseService} from './services/firebase.service';
import {UserNamePage} from './modals/user-name/user-name.page';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public router: Router,
    private navCtrl: NavController,
    public platform: Platform,
    public storage: Storage,
    public network: Network,
    public loading: LoadingService,
    public plt: Platform,
    private appVersion: AppVersion,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    private splashScreen: SplashScreen,
    private fbPluginAuth: FirebaseAuthentication,
    private authenticationService: AuthenticationService,
    private codePush: CodePush,
    private screenOrientation: ScreenOrientation,
    private eventSubscribe: EventServiceService,
    private loginPage: LoginPhonePage,
    private ngZone: NgZone,
    private fireAna: AngularFireAnalytics,
    private angularFireAuth: AngularFireAuth,
    private fbService: FirebaseService,
    public modalCtrl: ModalController,

  ) {
    this.initializeApp();
    let connectedToInternet = true;
    network.onDisconnect().subscribe(() => {
      connectedToInternet = false;
      this.shared.showAlertWithTitle("Please Connect to the Internet!", "Disconnected");
    });


    network.onConnect().subscribe(() => {
      if (!connectedToInternet) {
        window.location.reload();
        this.shared.showAlertWithTitle("Network connected Reloading Data" + '...', "Connected");
      }
    });
    document.documentElement.dir = this.config.appDirection;
    shared.dir = this.config.appDirection;

  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (environment.sync === true) {
        this.checkCodePush();
      }

     // this.navCtrl.navigateRoot("first-page");
/*
       setTimeout(() => {
        this.splashScreen.hide();
      }, 1000); */

    // this.screenOrientation.lock('portrait');
     // this.initialNavigation();


      this.authenticationService.authenticationState.subscribe(state => {
        if (state) {
          console.log('Auth State Called  :');
          this.doIfLoginTrue();
        } else {
         this.doIfLoginFalse();
          console.log('Auth State Called  :');

        }
      });

      this.checkUserLoginStatus();


      this.platform.resume.subscribe((result) => {
        if (environment.sync === true) {
          this.checkCodePush();
        }
      });
    });

  }

  loadHomePage() {
    this.openHomePage();
  }

  openHomePage() {
    console.log('Navigated to Tabs  :');
    this.navCtrl.navigateRoot("tabs");
   // this.router.navigate('new-request');
  }



  rateUs() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.iab.create(this.config.packgeName.toString(), "_system");
    } else if (this.plt.is('android')) {
      this.appVersion.getPackageName().then((val) => {
        this.iab.create("https://play.google.com/store/apps/details?id=" + val, "_system");
      });
    }
  }

  share() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.socialSharing.share(
        this.config.packgeName.toString(),
        this.config.appName,
        this.config.packgeName.toString(),
        this.config.packgeName.toString()
      );
    } else if (this.plt.is('android')) {

      this.appVersion.getPackageName().then((val) => {
        this.socialSharing.share(
          this.config.appName,
          this.config.appName,
          "",
          "https://play.google.com/store/apps/details?id=" + val
        );
      });
    }
  }



  checkCodePush() {

    this.codePush.sync({
    }).subscribe(
        (data) => {
          console.log('CODE PUSH SUCCESSFUL: ' + data);
        },
        (err) => {
          console.log('CODE PUSH ERROR: ' + err);
        }
    );
  }

  fecthIntialRequestsFromFb() {
    const cityOrMain = 'Main';
    const page = 1;
    const updateSubscription = this.fbService.readRequestData(cityOrMain, this.shared.requestLimit,
        page).toPromise().then( data => {
      const result = this.processRxRequestData(data, this.shared.requestListDown);
      console.log(this.shared.requestListDown);
      this.shared.startAtTimeStamp = result[0];
      this.shared.endAtTimeStamp = result[1];
  });
}

realTimeRequests() {
   // this.fbService.readRequestDataRealTime().valueChanges().subscribe(data => {
      this.shared.readRequestDataRealTimeSubscription =
          this.fbService.readRequestDataRealTime().snapshotChanges().subscribe(docQSnap => {
        let data = [];
        let metaData = [];
        docQSnap.forEach(docSnap => {
          console.log(docSnap.type);
          data.push(docSnap.payload.doc.data());
          metaData.push(docSnap.payload.doc.metadata);
          console.log(docSnap.payload.doc.metadata);
        });
        console.log('Real Time Update Executed, Data length:   ' + data.length);
        if (data.length > 0) {
          if (this.shared.firstTime === true) {
            this.shared.firstTime = false;
          } else {
            if (metaData[0].hasPendingWrites === false) {
             // this.shared.requestListUpReal.push(data[0]);
              this.shared.requestListUpReal.unshift(data[0]);

              console.log(this.shared.requestListUpReal);
              this.fbService.realTimeRequestEvent(data);
            } else {
              console.log('Not written to database');
            }
          }
        }
      });
    }


doMsgSubscription(userUid) {
    this.shared.getMsgSubscriptionSubscription =
        this.fbService.getMsgSubscription(userUid).valueChanges().subscribe(data => {
      this.shared.requestListDownMyChat = data.reverse();  //to show my chat list
       console.log('Message Subscription Data   :');
       console.log(data);
      for (let i = 0; i < data.length; i++) {
        let msgList = [];
        // @ts-ignore
        // @ts-ignore
        this.shared.readMsgDataSubscription = this.fbService.readMsgData(data[i].reqId, this.shared.limitReadMsg, data[i].timestamp).snapshotChanges(['child_added']).subscribe(snap => {
          msgList = [];
          // @ts-ignore
        //  console.log('Subscribed to request  :' + data[i].reqId);
          snap.forEach(x => {
            msgList.push(x.payload.val());
          });
          // @ts-ignore
          const msgListName = 'msg_' + data[i].reqId;
          this.calculateNoOfUnreadMsgs(msgListName, msgList).then(unreadCount => {
          // @ts-ignore
            const unReadCountMsg = {reqId: data[i].reqId, unreadCount: unreadCount};
            console.log(unReadCountMsg);
            this.fbService.unReadMsgCountEvent(unReadCountMsg);
          });
          this.storage.set(msgListName, msgList).then(() => {
            console.log(msgList);
            this.fbService.newMsgReceivedEvent(msgListName);
          }).catch(err => { console.log(err)});
        });
      }
    });
}

calculateNoOfUnreadMsgs(msgListName, msgList) {
    return new Promise(resolve => {
      const name = msgListName + '_last';
      const length = msgList.length;
      this.storage.get(name).then(timestamp => {
        console.log('Timestamp   :' + timestamp);
        if (timestamp === 0) {
          resolve (length);
        } else {
          const index = this.search(timestamp, msgList);
          if (index !== -1 ) {
            resolve (length - index - 1) ;
          }
        }
      }).catch(err => console.log(err));
    });

}

 search(timestamp, myArray) {
   for (let i = 0; i < myArray.length; i++) {
     if (myArray[i].timestamp === timestamp) {
       return i;
     }
   }
   return -1;
 }


  fecthIntialMyRequestsFromFb() {
    const page = 1;
    //let data = [];
    const updateSubscription = this.fbService.readRequestDataMy(this.shared.userUid, this.shared.requestLimit,
        page).toPromise().then( data => {
      const result = this.processRxRequestData(data, this.shared.requestListDownMyReq);
      this.shared.startAtTimeStampMyReq = result[0];
      this.shared.endAtTimeStampMyReq = result[1];
    });
  }

  processRxRequestData(inputArray, outputArray) {
    let out = [];
    let startTimestamp;
    let endTimestamp;
    inputArray.forEach(docSnap => {
      out.push(docSnap.data());
    });
    if (out.length > 0) {
      // @ts-ignore
      endTimestamp = out[0].timestamp;
      if (out.length > this.shared.requestLimit) {
        out.splice(0, 1);
      }
      out.reverse();
      // @ts-ignore
      startTimestamp = out[0].timestamp;
      const length = out.length;
     // console.log('Initial read length:  ' + length);
      for (let i = 0; i < length; i++) {
        outputArray.push(out[i]);
      }
     // console.log(outputArray);

      return [startTimestamp, endTimestamp];
    } else {
      console.log('No request data');
      return [ 0, 0 ];
    }
  }



  async goToUserNameModal() {
    const modal = await this.modalCtrl.create({
      component: UserNamePage,
      backdropDismiss: false,
    });
    return await modal.present();
  }
/*
  doIfLoginTrue() {
    console.log('UserId from Login is   :' + this.shared.userUid);
 //   console.log('UserID from AngularFire   :' + userUidAngular);
    this.fireAna.setUserId(this.shared.userUid);
    this.fecthIntialRequestsFromFb();
    this.realTimeRequests();
    this.fecthIntialMyRequestsFromFb();
    this.doMsgSubscription (this.shared.userUid);
    this.ngZone.run(() => {this.navCtrl.navigateRoot("tabs");});
    console.log('navigated to Tabs on start');
  } */

  doIfLoginFalse() {
    console.log('navigated to Login on start');
    this.storage.get('firsttimeApp').then((val) => {
      if (val === 'firstTime') {
        if (environment.production === true) {
          this.navCtrl.navigateRoot("first-page").then( () => {
            if (this.shared.isUserloggedIn) {
              this.navCtrl.navigateRoot("tabs");
              console.log('navigated to tabs from first-page');
            }
          });
        } else {
          this.navCtrl.navigateRoot("first-page").then( () => {
            if (this.shared.isUserloggedIn) {
              this.navCtrl.navigateRoot("tabs");
              console.log('navigated to tabs from first-page');

            }
          });
        }
      } else {
        this.navCtrl.navigateRoot("intro");
        this.storage.set('firsttimeApp', 'firstTime');
      }
    }).catch(() => {
      console.log('FirstTimeApp not stored in storage   :');
      this.navCtrl.navigateRoot("intro");
      this.storage.set('firsttimeApp', 'firstTime');
    });
  }

  checkUserLoginStatus() {
    this.fbPluginAuth.onAuthStateChanged().subscribe(userInfo => {
      console.log('came here fb plugin auth');
      if (userInfo) {
        console.log(userInfo);
        this.shared.isUserloggedIn = true;
        this.shared.userInfo = userInfo;
        this.shared.userUid = userInfo.uid;
        this.fireAna.setUserId(this.shared.userUid);
        this.authenticationService.authenticationState.next(true);
        console.log('UserId from Login is   :' + this.shared.userUid);
      } else {
        console.log('No User');
        this.authenticationService.authenticationState.next(false);
        this.shared.userInfo = null;
        this.shared.isUserloggedIn = false;
        this.shared.userUid = null;
      }
    });
  }

  initialNavigation() {

  }

  doIfLoginTrue() {

    this.fecthIntialRequestsFromFb();
    this.realTimeRequests();
    this.fecthIntialMyRequestsFromFb();
    this.doMsgSubscription(this.shared.userUid);
    this.ngZone.run(() => {
      this.navCtrl.navigateRoot("tabs");
      console.log('navigated to Tabs on start');
    });

    this.authenticationService.checkUserName(this.shared.userUid).then(userName => {
      console.log('The username for this user   :' + userName);
      this.shared.userName = userName;
      this.shared.isUserNameSet = true;
      this.loading.hide();
    }).catch(err => {
      console.log(err);
      this.loading.hide();
      this.goToUserNameModal().then(() => {
      /*  this.ngZone.run(() => {
          this.navCtrl.navigateRoot("tabs");
        }); */

      });
    });

    this.authenticationService.loginToAngularFire().then(resBol => {
        console.log('Fresh Logged in to Angular Fire');
    }).catch(err => {
      this.shared.showAlertWithTitle('Unable to login to Angular Fire', err);
    });


  }
}
