import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, NavController} from '@ionic/angular';
import {FirebaseService} from '../services/firebase.service';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {DataService} from '../services/data.service';
import {NavigationExtras} from '@angular/router';

@Component({
  selector: 'app-my-chats',
  templateUrl: './my-chats.page.html',
  styleUrls: ['./my-chats.page.scss'],
})
export class MyChatsPage implements OnInit {

  @ViewChild(IonInfiniteScroll, {static: false}) infinite: IonInfiniteScroll;

  constructor(
      public navCtrl: NavController,
      private fbService: FirebaseService,
      public shared: SharedDataService,
      private dataService: DataService,
  ) {
  }

  initiateNewRequest() {
    this.navCtrl.navigateForward("/new-request");
  }

  ngOnInit() {
    console.log(this.shared.requestListDownMyChat);

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

}
