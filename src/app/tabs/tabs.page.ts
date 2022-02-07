import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
showUnreadMsg = false;
unReadMsgCountData;

  constructor(
      private fbService: FirebaseService,
  ) {

    this.fbService.unReadMsgCountSubject.subscribe(data => {
      this.unReadMsgCountData = data;
      if (this.unReadMsgCountData.unreadCount > 0) {
        this.showUnreadMsg = true;
      }
    });
  }

  ngOnInit() {
  }

}
