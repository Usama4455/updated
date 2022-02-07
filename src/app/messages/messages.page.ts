import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseService} from '../services/firebase.service';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import { Storage } from '@ionic/storage';
import {loadRules} from 'tslint';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
request;
message = '';
messagedAllowed = '@';
messagesToShow = [];
msgSubscription = false;
msgListName = '' ;
newMsgSubscription;
disableSend = false;
ownerUsername = '';
  constructor(
      private actRoute: ActivatedRoute,
      private router: Router,
      private fbService: FirebaseService,
      private shared: SharedDataService,
      private storage: Storage,
  ) {
      this.newMsgSubscription = this.fbService.newMsgReceivedSubject.subscribe( rxData => {
          console.log(rxData);
          if (rxData === this.msgListName) {
              this.retrieveMsgFromDisk(rxData);
          } else {
              console.log('other msg than in view');
          }
      });
  }

  ngOnInit() {
    this.actRoute.queryParams.subscribe(params => {
      const temp = this.router.getCurrentNavigation().extras.queryParams;
      this.request = temp['request'];
      this.request.unreadCount = 0;
      const unReadCountMsg = {reqId: this.request.reqId, unreadCount: this.request.unreadCount};
      this.fbService.unReadMsgCountEvent(unReadCountMsg);
      console.log(this.request);
      this.msgListName = 'msg_' + this.request.reqId;
      const userId = this.request.ownerId;
      this.ownerUsername = this.request.username;
      this.retrieveMsgFromDisk(this.msgListName, userId);
    });
  }

  retrieveMsgFromDisk(msgListName, userId?) {
      this.storage.get(msgListName).then( data => {
          console.log('From Message NgOnit   ' + data);
          if (data) {
              this.disableSend = false;
              this.messagesToShow = data;
              this.msgSubscription = true;
              console.log('Subscribed Messages   :' + this.messagesToShow);
              const length = data.length;
              if (length > 0) {
                  const name = msgListName + '_last';
                  this.storage.set( name, data[length - 1].timestamp);
                  console.log(name + '  Set');
              }
               if (length === 0 && userId === this.shared.userUid) {
                   this.disableSend = true;
                   console.log('Disabled  : ' + this.disableSend);
               }
          } else {
              this.msgSubscription = false;
              console.log('Disabled  : ' + this.disableSend);
              if (userId) {
                  if (userId === this.shared.userUid) {
                      this.disableSend = true;
                      console.log('Disabled  : ' + this.disableSend);
                  }
              }
          }
          console.log(this.msgSubscription);
      });
  }


  msgSubmit(type) {
    const reqId = this.request.reqId;
    console.log(reqId);
    const timeStamp = this.fbService.getTimeStampRtdb();
    this.fbService.generateId().then(msgId => {
        const message = {
            date: new Date().toString(),
            senderId: this.shared.userUid,
            message: this.message,
            timestamp: timeStamp,
            allowed: this.messagedAllowed,
            msgId: msgId,
        };

        let imagesUrl = [];
        if ('images' in this.request) {
            if (this.request.images.length > 0) {
                imagesUrl = this.request.images;
            }
        }

        const dataSub = {
            reqId: reqId,
            city: this.request.city,
            images: imagesUrl,
            message: this.request.message,
            ownerId: this.request.ownerId,
            timestamp: timeStamp,
            username: this.ownerUsername,
        };

        console.log('Message sub is :' + this.msgSubscription);
        console.log('Req id is :' + reqId);


        if (this.msgSubscription === false) {
            this.fbService.updateMsgSubscription(this.shared.userUid, reqId, dataSub).then(() => {
                console.log('Message Subscription Updated  :');
            }).catch(err => {
                console.log(err);
            });
        }
        this.fbService.updateMessageData(reqId, msgId, message).then(() => {
            console.log('Messages  :' + message);
            //this.messagesToShow.push(message);
            const msg = {
               reqid: reqId,
            };

            const name = 'msg_' + this.request.reqId + '_last'; //to deny notification when message is owns
            this.storage.set( name, timeStamp);

            this.fbService.updateUserMessages(this.shared.userUid, msgId, msg).then(() => {
                    this.message = '';
                    console.log('done message');
                }
            ).catch(err => {console.log(err);});

        }).catch(err => {console.log(err);});
    }).catch(err => {console.log(err);});
  }

    // Check if the user is the sender of the message.
    isSender(message) {
        if (message.senderId === this.shared.userUid) {
            return true;
        } else {
            return false;
        }
    }

    ionViewDidLeave() {
        this.newMsgSubscription.unsubscribe();
        console.log('New Msg Subscription Unsubscribed');
    }
}
