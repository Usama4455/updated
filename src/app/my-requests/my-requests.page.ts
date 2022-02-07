import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, NavController} from '@ionic/angular';
import {FirebaseService} from '../services/firebase.service';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {DataService} from '../services/data.service';
import {NavigationExtras} from '@angular/router';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.page.html',
  styleUrls: ['./my-requests.page.scss'],
})
export class MyRequestsPage implements OnInit {

  @ViewChild(IonInfiniteScroll, {static: false}) infinite: IonInfiniteScroll;
  page = 2;
  temp: any;
  showLoadMoreMessage = false;
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

  }

  ionViewDidEnter() {
  }
  
  initiateNewRequest() {
    this.navCtrl.navigateForward("/new-request");
  }

  ngOnInit() {
  }

  loadMoreRequests(cityOrMain) {
    this.getDataFromServer(cityOrMain, 2);
    this.infinite.complete();
  }

  enableDisableInfiniteScroll(val) {
    this.infinite.disabled = !val;
  }

  getDataFromServer(cityOrMain, p) {
    // const cityOrMain = 'Main';
    const endAt = this.shared.endAtTimeStampMyReq;
    //this.page = 2;
    let data = [];
    this.fbService.readRequestDataMy(this.shared.userUid, this.shared.requestLimit,
        p, endAt).toPromise().then( docQSnap => {
      docQSnap.forEach(docSnap => {
        data.push(docSnap.data());
      });
      let numRetrievedResults = data.length;
      if (numRetrievedResults > this.shared.requestLimit) {
        // @ts-ignore
        this.shared.endAtTimeStampMyReq = data[0].timestamp;
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
          this.shared.requestListDownMyReq.push(data[i]);
        }
      }
    }).catch( err => { console.log(err);});
  }


  doRefresh(event) {
    //  const cityOrMain = 'Main';
    let data =[];
    const starAt = this.shared.startAtTimeStampMyReq;
    this.fbService.readRequestDataRefreshMy(this.shared.userUid, this.shared.requestLimit,
        starAt).toPromise().then(docQSnap => {
      docQSnap.forEach(docSnap => {
        data.push(docSnap.data());
      });
      const numRetrievedResults = data.length;
      console.log('Number of my messages   :' + numRetrievedResults);
      if (numRetrievedResults === 1) {
        this.shared.startAtTimeStampMyReq = 0;
        this.shared.requestListUpMyReq.push(data[0]);
      } else if (numRetrievedResults > 1) {
        if (numRetrievedResults > this.shared.requestLimit) {
          this.showLoadMoreMessage = true;
        }
        // @ts-ignore
        this.shared.startAtTimeStampMyReq = data[numRetrievedResults - 1].timestamp;
       // console.log('start timestamp   :' + this.shared.startAtTimeStamp);
        data.splice(0,1);
        data.reverse();
        console.log(data);
        if (data.length === 1) {
          for ( let i = 0; i < data.length; i++ ) {
            this.shared.requestListUpMyReq.unshift(data[i]);
          }
        } else {
          for ( let i = 0; i < data.length; i++ ) {
            this.shared.requestListUpMyReq.push(data[i]);
          }
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


  search(reqID, myArray) {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].reqId === reqID) {
        return i;
      }
    }
    return -1;
  }


}
