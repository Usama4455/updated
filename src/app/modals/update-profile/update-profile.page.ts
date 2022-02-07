import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, ToastController} from '@ionic/angular';
import {LoadingService} from '../../../providers/loading/loading.service';
import {SharedDataService} from '../../../providers/shared-data/shared-data.service';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../providers/config/config.service';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {
first_name = '';
last_name = '';
user_email = '';
  constructor(
      public modalCtrl: ModalController,
      public loading: LoadingService,
      public shared: SharedDataService,
      public toastController: ToastController,
      public http: HttpClient,
      public config: ConfigService,
      public storage: Storage,
  ) { }

  updateProfile() {
    this.loading.show();
    const update_profile = {
      first_name : this.first_name,
      last_name : this.last_name,
      user_email : this.user_email,
    };
    const url = this.config.url + '/wp-json/my-life/v1/update_profile';
    this.config.postWithUrlAuth(url, update_profile).then(() => {
      this.loading.hide();
      this.config.getWoo("customers/" + this.shared.customerData.id + "?" + this.config.productsArguments).then((dataW: any) => {
        this.storage.set('customerData', dataW);
        this.shared.customerData = dataW;
        this.presentToast('Profile Updated Successfully');
        this.dismiss();
      });
    }).catch(() => {
      this.loading.hide();
      this.presentToast('Unable to Update Profile').then(() => {
        this.dismiss();
      });
    });
  }

  dismiss() {
    this.modalCtrl.dismiss().then(() => {
      // this.navCtrl.navigateRoot("/tabs");
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


  ngOnInit() {
  }

}
