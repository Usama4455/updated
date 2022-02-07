import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';

import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HttpClient } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import {AuthenticationService} from '../services/authentication.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  setting: { [k: string]: any } = {};
  constructor(
    public config: ConfigService,
    private storage: Storage,
    public loading: LoadingService,
    public http: HttpClient,
    public shared: SharedDataService,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    public plt: Platform,
    private appVersion: AppVersion,
    private auth: AuthenticationService,
    private fireAna: AngularFireAnalytics,
  ) {
  }
  ionViewDidEnter() {
      this.fireAna.setCurrentScreen('settings');
  }



  logOut() {
   // this.shared.logOut();
    this.auth.logout().then(() => {
      this.fireAna.logEvent('clicked_logout', {user_name: this.shared.userName});
    });
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

  getNameFirstLetter() {
    return this.shared.getNameFirstLetter();
  }

  ngOnInit() {
  }

}
