// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Injectable, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { ConfigService } from '../config/config.service';

import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser/ngx';
import { LoadingService } from '../loading/loading.service';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import {EventServiceService} from '../../app/services/event-service.service';
import { FileEntry } from '@ionic-native/file/ngx';


@Injectable()
export class SharedDataService {
  public isUserNameSet = false;
  public requestLimit = 10;
  public limitReadMsg = 10;
  public requestListDown = [];
  public requestListUp = [];
  public requestListUpReal = [];
  public requestListDownTmp = [];
  public requestListUpTmp = [];
  public endAtTimeStamp;
  public endAtTimeStampTmp;
  public startAtTimeStamp;
  public startAtTimeStampTmp;
  public userUid = '';

  public firstTime = true;

  public requestListDownMyReq = [];
  public requestListUpMyReq = [];
  public endAtTimeStampMyReq;
  public startAtTimeStampMyReq;

  public requestListDownMyChat = [];
  public readRequestDataRealTimeSubscription;
  public getMsgSubscriptionSubscription;
  public readMsgDataSubscription;


  public userEmail = '';
  public userPassword = '';
  public userName: any;
  public userInfo: any;

  public banners = [];
  public tab1: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public tab2: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public tab3: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public vendors = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public allCategories: any =  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public categories: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public subCategories: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public customerData: { [k: string]: any } = {};
  public recentViewedProducts = new Array();
  public wishListProducts = new Array();
  public cartProducts = new Array();
  public couponArray = new Array();
  public cartquantity;
  public wishList = new Array();
  public tempdata: { [k: string]: any } = {};
  public dir = "ltr";
  public selectedFooterPage = "HomePage";
  public cartTempProducts = [];
  public translationListArray = [];
  billing = {
    first_name: '',
    last_name: '',
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    email: '',
    phone: ''
  };
  billingCountryName = "";
  billingStateName = "";
  shipping = {
    first_name: '',
    last_name: '',
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
  };
  shippingCountryName = "";
  shippingStateName = "";
  shipping_lines = [];
  listTaxRates = [];
  sameAddress = false;
  checkOutPageText = "Place Your Order";
  public device = '';
  public attributes = [];
  public headerHexColor = "#51688F";
  singlePostData: any;
  singleProductPageData = [];
  myOrderDetialPageData: { [k: string]: any; };
  storePageData = [];
  totalCartPrice = 0;
  cashToCollectFromCustomer: number;
  totalMarginPrice = 0;
  public customerToken = '';
  public isUserloggedIn = false;
  public phoneNumber ='';
  bankName = '';
  accountNumber = '';
  branchName = '';
  realAllCategories: any;
  realAllProducts: any;
  realAllAttributes: any;

  constructor(private http: HttpClient,
    public config: ConfigService,
    private storage: Storage,
    public loading: LoadingService,
    public platform: Platform,
    private spinnerDialog: SpinnerDialog,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private themeableBrowser: ThemeableBrowser,
    private applicationRef: ApplicationRef,
    public splashScreen: SplashScreen,
    private eventSubscribe: EventServiceService,
  ) {
  }
  public splashScreenHide = false;
  hideSplashScreen() {
    if (this.platform.is('cordova')) {
      if (!this.splashScreenHide) { this.splashScreen.hide(); this.splashScreenHide = true; }
    }
  }

  getNameFirstLetter() {
    return this.customerData.first_name.charAt(0);
  }

  async showAlertWithTitle(text, title) {
      let alert = await this.alertCtrl.create({
        header: title,
        message: text,
        buttons: ["ok"],
      });
      await alert.present();
  }

 async showAlert(text) {
      const alert = await this.alertCtrl.create({
        header: "Alert",
        message: text,
        buttons: ["ok"],
      });
      await alert.present();}

  //=================================================

  reset(){
  this.requestListDown = [];
  this.requestListUp = [];
    this.requestListUpReal = [];
    this.requestListDownTmp = [];
    this.requestListUpTmp = [];
    this.endAtTimeStamp = null;
    this.endAtTimeStampTmp = null;
    this.startAtTimeStamp = null;
    this.startAtTimeStampTmp = null;
    this.userUid = '';
    this.requestListDownMyReq = [];
    this.requestListUpMyReq = [];
    this.endAtTimeStampMyReq = null;
    this.startAtTimeStampMyReq = null;

    this.requestListDownMyChat = [];
  }

  delay = (time: number) =>
      new Promise(resolve => setTimeout(() => resolve(), time));

  getBlobFromFileEntry = (fileEntry: FileEntry): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      fileEntry.file((file) => {
        const reader = new FileReader();
        reader.onloadend = (e) =>  {
          try {
            // @ts-ignore
            //
            console.log(reader.result);
            // const { this.result: buffer } = reader.result;
            const blob = new Blob(
                [reader.result],
                { type: file.type }
            );
            resolve(blob);
          } catch (error) {
            reject(error);
          }
        };
        reader.onabort = (ev) => reject(ev);
        reader.onerror = (ev) => reject(ev);
        reader.readAsArrayBuffer(file);
      }, reject);
    });
  }
}
