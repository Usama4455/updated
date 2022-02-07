import {ApplicationRef, Injectable} from '@angular/core';
import { Platform } from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {BehaviorSubject} from 'rxjs';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {LoadingService} from '../../providers/loading/loading.service';
import {FirebaseAuthentication} from '@ionic-native/firebase-authentication/ngx';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirebaseService} from './firebase.service';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
declare let cordova;


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  newToken: any;
  authenticationState = new BehaviorSubject(false);
  startUpModalShow = new BehaviorSubject(true);

  constructor(
      public storage: Storage,
      private plt: Platform,
      public shared: SharedDataService,
      private applicationRef: ApplicationRef,
      public loading: LoadingService,
      private fbAuthPlugin: FirebaseAuthentication,
      public auth: AngularFireAuth,
      private fbService: FirebaseService,
      public http: HttpClient,

  ) {
   /* this.plt.ready().then(() => {
      this.checkToken();
    }); */
  }

  checkToken() {
    this.storage.get('customerToken').then(res => {
      if (res) {
        console.log('Token True');
        this.shared.isUserloggedIn = true;
        this.authenticationState.next(true);
      }
    }).catch(err => {
      console.log('Token False');
      this.authenticationState.next(false);
    });

  }

  login(token) {
    this.shared.customerToken = token;
    this.storage.set('customerToken', token ).then(() => {
      this.shared.isUserloggedIn = true;
      return this.authenticationState.next(true);
    });
    this.applicationRef.tick();
  }

  logout() {
    this.loading.autoHide(500);
    return new Promise(resolve => {
      this.shared.isUserloggedIn = false;
      this.shared.userName = null;
      this.resetsAndUnSubscribe();

      let promises = [];
      promises.push(this.storage.clear()); //though it cleras all the dataß
      promises.push(this.storage.remove('firsttimeApp').then(() => {
        console.log('First time token removed');
      }).catch(err => { console.log('First time not removed'); console.log(err);}));
      promises.push(this.storage.remove('customerToken'));
      promises.push(this.fbAuthPlugin.signOut().then(() => {
        this.auth.auth.signOut().then(() => {
        });
        this.authenticationState.next(false);
      }).catch( err => {
        console.log('Error in logging out');
      }));
      Promise.all(promises).then(() => {
        resolve(true);
      });
    });

  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
  startUpModalHide() {
    this.startUpModalShow.next(false);
  }
  isStartUpModalShow() {
    return this.startUpModalShow.value;
  }

  getCurrentUserUid() {
    return new Promise((resolve, reject) => {
      cordova.plugins.firebase.auth.getCurrentUser().then(userInfo => {
        if (userInfo) {
          const userUid = userInfo.uid;
          resolve (userUid);
        } else {
          reject ('No firebase Logged in Uid');
        }
      }).catch(err => {console.log(err); reject(err);});
    });
  }

  getCurrentUserUidAfire() {
    return new Promise((resolve, reject) => {
      const currentUser = this.auth.auth.currentUser;
      if (currentUser) {
        const userUid = currentUser.uid;
        console.log(userUid);
        resolve(userUid);
      } else {
        this.loginToAngularFire().then(res => {
          const userUid = this.auth.auth.currentUser.uid;
          console.log(userUid);
          resolve(userUid);
        }).catch(err => {
          reject(false);
        });
      }
    });
  }


  checkUserName(userUid) {
    return new Promise((resolve , reject) => {
      const sub = this.fbService.getUserName(userUid).valueChanges().subscribe(loginData => {
        sub.unsubscribe();
        if (loginData.length !== 0) {
          console.log('User Data Exists');
          // @ts-ignore
          this.shared.userName = loginData[0].username;
          resolve (this.shared.userName);
        } else {
          console.log('User Data dont exist');
          reject('No user Name');
        }
      });
    });
  }


  loginToAngularFire() {
    return new Promise((resolve , reject ) =>  {
      this.fbAuthPlugin.getIdToken(true).then(iDToken => {
        const verifyUrl = environment.verifyUrl;
        const sub = this.http.get(verifyUrl + '/api/users?token=' + iDToken).subscribe(
            rxToken => {
              sub.unsubscribe();
              this.newToken = rxToken;
              // console.log('RxToken   :' + this.newToken.token);
              this.auth.auth.signInWithCustomToken(this.newToken).then(data => {
                console.log('Logged In to Angular Fire  :');
                // console.log(data);
                resolve (true);
              }).catch(err => {
                console.log(err);
                reject(err);
              });
            });
      }).catch( err => { reject(err);});
    });
  }

  resetsAndUnSubscribe() {
    this.shared.firstTime = true;
    this.shared.reset();
    this.shared.readRequestDataRealTimeSubscription.unsubscribe();
   // this.shared.readMsgDataSubscription.unsubscribe();
    this.shared.getMsgSubscriptionSubscription.unsubscribe();
  }


}
