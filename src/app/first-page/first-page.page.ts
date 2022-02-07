import { Component, OnInit } from '@angular/core';
import {LoginPhonePage} from '../modals/login-phone/login-phone.page';
import {ModalController, NavController} from '@ionic/angular';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {LoginEmailPage} from '../modals/login-email/login-email.page';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {AuthenticationService} from '../services/authentication.service';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.page.html',
  styleUrls: ['./first-page.page.scss'],
})
export class FirstPagePage implements OnInit {

  constructor(
      public modalCtrl: ModalController,
      private fireAna: AngularFireAnalytics,
      private shared: SharedDataService,
      private authService: AuthenticationService,
      private navCtrl: NavController,

  ) {
    this.shared.isUserNameSet = false;
    this.authService.authenticationState.subscribe(data => {
    if (data) {
     // this.navCtrl.navigateRoot("tabs");
    }
    });
  }

  async goToSignUpPagePhone(){
    this.fireAna.logEvent('clicked_signup');
    const modal = await this.modalCtrl.create({
      // component: LoginEmailPage,
      component: LoginPhonePage,
      //LoginEmailPage
    });
    return await modal.present();
  }

  async goToSignUpPageEmail() {
    this.fireAna.logEvent('clicked_signup');
    const modal = await this.modalCtrl.create({
     component: LoginEmailPage,
      //LoginEmailPage
    });
    return await modal.present();
  }

  ngOnInit() {
  }

}
