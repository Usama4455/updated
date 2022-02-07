import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, NavController} from '@ionic/angular';
import {FirebaseService} from '../services/firebase.service';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {DataService} from '../services/data.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.page.html',
  styleUrls: ['./time-line.page.scss'],
})
export class TimeLinePage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infinite: IonInfiniteScroll;
  page = 2;
  temp: any;
  showLoadMoreMessage = false;
  public searchTerm = '';
  public items: any;
  showList = false;
  city = '';
  cityOrMain = 'Main';
  unReadMsgCount;
  unReadMsgCountSub;
  constructor(
      public navCtrl: NavController,
      private fbService: FirebaseService,
      public shared: SharedDataService,
      private dataService: DataService,
  ) {
    this.unReadMsgCountSub = this.fbService.unReadMsgCountSubject.subscribe(data => {
      this.unReadMsgCount = data;
      console.log(this.unReadMsgCount);
     this.processUnreadMsgCount();

    });

    this.fbService.realTimeRequestSubject.subscribe( data => {
      if (this.cityOrMain === 'Main') {
        this.shared.requestListUp = this.shared.requestListUpReal;
      } else {
        this.shared.requestListUpTmp = this.shared.requestListUpReal;
      }
    });
  }

  processUnreadMsgCount() {
    let outIndex = this.search(this.unReadMsgCount.reqId, this.shared.requestListDown);
    if (outIndex !== -1) {
      this.shared.requestListDown[outIndex].unreadCount = this.unReadMsgCount.unreadCount;
    }
    outIndex = this.search(this.unReadMsgCount.reqId, this.shared.requestListUp);
    if (outIndex !== -1) {
      this.shared.requestListUp[outIndex].unreadCount = this.unReadMsgCount.unreadCount;
    }
    /***********************************************/
    outIndex = this.search(this.unReadMsgCount.reqId, this.shared.requestListDownMyReq);
    if (outIndex !== -1) {
      this.shared.requestListDownMyReq[outIndex].unreadCount = this.unReadMsgCount.unreadCount;
     // console.log(this.shared.requestListDownMyReq);
    }
    outIndex = this.search(this.unReadMsgCount.reqId, this.shared.requestListUpMyReq);
    if (outIndex !== -1) {
      this.shared.requestListUpMyReq[outIndex].unreadCount = this.unReadMsgCount.unreadCount;
    }

    /***********************************************/
    outIndex = this.search(this.unReadMsgCount.reqId, this.shared.requestListDownMyChat);
    if (outIndex !== -1) {
      this.shared.requestListDownMyChat[outIndex].unreadCount = this.unReadMsgCount.unreadCount;
     // console.log(this.shared.requestListDownMyReq);
    }
  }


  setFilteredItems() {
    this.items = this.dataService.filterItems(this.searchTerm);
  }

  searchBarFocus() {
    this.showList = true;
  }

  searchBarCancel() {
    this.searchTerm = '';
    this.showList = false;
    this.city = '';
    this.convertToMain();
  }

  searchBarClear() {
    this.searchTerm = '';
    this.showList = false;
    this.city = '';
    console.log('Search Bar Clear');
    this.convertToMain();
  }

  convertToMain() {
    this.cityOrMain = 'Main';
    this.shared.requestListUp = this.shared.requestListUpTmp;
    this.shared.requestListDown = this.shared.requestListDownTmp;
    this.shared.startAtTimeStamp = this.shared.startAtTimeStampTmp;
    this.shared.endAtTimeStamp = this.shared.endAtTimeStampTmp;
    this.enableDisableInfiniteScroll(true);
   // this.getDataFromServer( 'Main', 2);
  }

  clickItem(index) {
    this.searchTerm = this.items[index].name;
    console.log(index);
    console.log(this.searchTerm);
    console.log('city   :' + this.city);
    this.city = this.searchTerm.toString();
    this.cityOrMain = this.city;
    this.enableDisableInfiniteScroll(true);
    this.cityTimeline(this.city);
  }

  cityTimeline(city) {
    this.shared.requestListUpTmp = this.shared.requestListUp;
    this.shared.requestListDownTmp = this.shared.requestListDown;
    this.shared.startAtTimeStampTmp = this.shared.startAtTimeStamp;
    this.shared.endAtTimeStampTmp = this.shared.endAtTimeStamp;
    this.shared.requestListDown = [];
    this.shared.requestListUp = [];
    this.shared.endAtTimeStamp = 0;
    this.shared.startAtTimeStamp = 0;
    //this.fetchInitialDataFromFb(city);
    this.getDataFromServer( city, 1 );
  }

  ionViewWillEnter() {
  //  console.log(this.shared.requestListDown);
    // this.getDataFromServer();
  }

  initiateNewRequest() {
    this.navCtrl.navigateForward("/new-request");
  }
  ngOnInit() {

  }

  loadMoreRequests(cityOrMain) {
    console.log('Load more requests Executed');
   this.getDataFromServer(cityOrMain, 2);
    this.infinite.complete();
  }

  enableDisableInfiniteScroll(val) {
    this.infinite.disabled = !val;
  }

  getDataFromServer(cityOrMain, p) {
    // const cityOrMain = 'Main';
    const endAt = this.shared.endAtTimeStamp;
    //this.page = 2;
    let data = [];
    this.fbService.readRequestData(cityOrMain, this.shared.requestLimit,
        p, endAt).toPromise().then( docQSnap => {
      docQSnap.forEach(docSnap => {
          data.push(docSnap.data());
        });
      let numRetrievedResults = data.length;
      if (numRetrievedResults > this.shared.requestLimit) {
        // @ts-ignore
        this.shared.endAtTimeStamp = data[0].timestamp;
        data.splice(0, 1);
        this.enableDisableInfiniteScroll(true);
      }

      if (numRetrievedResults <= this.shared.requestLimit) {
        this.enableDisableInfiniteScroll(false);
      }

      if (numRetrievedResults > 0) {
        data.reverse();
        console.log(data);
        const tmp = data.length;
        for (let i = 0 ; i < tmp ; i++) {
          this.shared.requestListDown.push(data[i]);
        }
      }
    }).catch( err => { console.log(err);});
  }


  doRefresh(event) {
  //  const cityOrMain = 'Main';
    let data =[];
    const starAt = this.shared.startAtTimeStamp;
    this.fbService.readRequestDataRefresh(this.cityOrMain, this.shared.requestLimit,
        starAt).toPromise().then(docQSnap => {
      docQSnap.forEach(docSnap => {
        data.push(docSnap.data());
      });
      const numRetrievedResults = data.length;
      if (numRetrievedResults > 1) {
        if (numRetrievedResults > this.shared.requestLimit) {
          this.showLoadMoreMessage = true;
        }
        // @ts-ignore
        this.shared.startAtTimeStamp = data[numRetrievedResults - 1].timestamp;
        console.log('start timestamp   :' + this.shared.startAtTimeStamp);
        data.splice(0,1);
        data.reverse();
        console.log(data);
        for ( let i = 0; i < data.length; i++ ) {
          this.shared.requestListUp.push(data[i]);
        }
      } else {
        this.msgNoNewRequest();
      }
     // this.doRefreshFunction(this.cityOrMain);

      setTimeout(() => {
        event.target.complete();
      }, 1500);
    });
  }

  msgNoNewRequest() {
    console.log('No New msg');
  }

  goToMessages(m) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        request: m,
      }
    };
    this.navCtrl.navigateForward('messages', navigationExtras);
    console.log(m);
  }

  ionViewWillLeave() {
  }

  ionViewDidLeave() {
    //this.unReadMsgCountSub.unsubscribe();
    //this.convertToMain();
    console.log('did leave');
  }

  search(reqID, myArray) {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].reqId === reqID) {
        return i;
      }
    }
    return -1;
  }


}
