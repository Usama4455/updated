import { Injectable } from '@angular/core';
//import {AngularFirestore} from '@angular/fire/firestore';
//import {AngularFireAuth} from '@angular/fire/auth';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../providers/config/config.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {BehaviorSubject, Subject} from 'rxjs';
import {database, firestore} from 'firebase/app';
import {AngularFirestore} from '@angular/fire/firestore';
//import FieldValue = firebase.firestore.FieldValue;
//import * as firebase from 'firebase';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  newMsgReceivedSubject = new BehaviorSubject('null');
  unReadMsgCountSubject = new BehaviorSubject('null');
  realTimeRequestSubject = new BehaviorSubject('null');


    constructor(
      //public afAuth: AngularFireAuth,
      private http: HttpClient,
      public config: ConfigService,
      private rtdb: AngularFireDatabase,
      private af: AngularFirestore,
  ) { }

    newMsgReceivedEvent(msgUri) {
        this.newMsgReceivedSubject.next(msgUri);
    }

    unReadMsgCountEvent(unReadCountMsg) {
        this.unReadMsgCountSubject.next(unReadCountMsg);
    }

    realTimeRequestEvent(data) {
        this.realTimeRequestSubject.next(data);
    }



/**
  async deleteDoc(coll: string, docId: string) {
    const id = docId;
    const docRef = this.afs.collection(coll).doc(id);
    return await docRef.delete();
  } */

/**
  async setNewDoc(coll: string, data: any, docId: string) {
    const id = docId;
    // console.log(id);
    const docRef = this.afs.collection(coll).doc(id);
    return await docRef.set(data);
  } */

/**
  async updateDoc(coll: string, data: any, docId: string) {
    const id = docId;
    // console.log(id);
    const docRef = this.afs.collection(coll).doc(id);
    return await docRef.update(data);
  } */

/**
  async getDoc(coll: string, docId: string) {
    return this.afs.collection(coll).doc(docId).get().toPromise();
  } */

  get timestamp() {
    const d = new Date();
    return d;
    //return firebase.firestore.FieldValue.serverTimestamp();
  }

/**
  queryProducts(coll: string, fieldDoc: string, operatorSym, valueData, limitData: number, orderBy, direction) {
    return this.afs.collection(coll, ref =>
        ref.where(fieldDoc, operatorSym, valueData).limit(limitData).orderBy(orderBy , direction)
    ).valueChanges();
  }*/

/**
queryProducts(coll: string, fieldDoc: string, operatorSym, valueData, limitData: number, orderBy, direction, startValue, page) {
  if (page === 1) {
    return this.afs.collection(coll, ref =>
        ref.where(fieldDoc, operatorSym, valueData).limit(limitData).orderBy(orderBy , direction)
    ).get();
  } else {
    return this.afs.collection(coll, ref =>
        ref.where(fieldDoc, operatorSym, valueData).limit(limitData).orderBy(orderBy , direction).startAfter(startValue)
    ).get();
  }

} */

/**
  queryProductsTest(coll: string, fieldDoc: string, operatorSym, valueData, limitData: number, orderBy, direction, startValue, page) {
    if (page === 1) {
      return this.afs.collection(coll, ref =>
          ref.where(fieldDoc, operatorSym, valueData).limit(limitData).orderBy(orderBy , direction)
      ).valueChanges();
    } else {
      return this.afs.collection(coll, ref =>
          ref.where(fieldDoc, operatorSym, valueData).limit(limitData).orderBy(orderBy , direction).startAfter(startValue)
      ).valueChanges();
    }

  } */

/**
  queryProductsShadow(coll: string, valueData) {
    return this.afs.collection(coll, ref =>
        ref.where('on_sale', '==', false).limit(10)
    ).valueChanges();
  } */


  getRtdb(path: string) {
    return this.rtdb.object(path).valueChanges();
  }

 /** getFirestoreWhereEqualTo(coll: string, docId: string) {
    return this.afs.collection(coll, ref =>
        ref.where('on_sale','==', false).limit(10)
    ).valueChanges();
  }*/

 generateId(): Promise<any> {
     return new Promise(resolve => {
         const id = this.rtdb.createPushId();
         resolve(id);
     });
 }
/**
 uploadRequestCity(reqId, request, city: string) {
     return this.rtdb.object('/requests/' + city + '/' + reqId).update(request);
 } */

    uploadRequestCommon(reqId, request) {
        return this.af.collection('requests').doc(reqId).set(request);
    }

/**
    uploadRequestMain(reqId, request) {
        return this.rtdb.object('/requests/Main/' + reqId).update(request);
    } */

  /*  updateUsersRequest(userUid, reqId, request) {
        return this.rtdb.object('/users/' + userUid + '/requests/' + reqId).update(request);
    } */

    updateUsersRequestCommon(userUid, reqId, request) {
       // console.log('UserId    :' + userUid);
        return this.af.collection('users').doc(userUid + '/requests/' + reqId).set(request);
    }

    readRequestData(cityOrMain: string, limitResults, p, endAt?) {
     if (cityOrMain === 'Main') {
        if (p === 1) {
         return this.af.collection('requests', ref => ref.limitToLast(limitResults + 1)
             .orderBy('timestamp')).get();
     } else {
         return this.af.collection('requests', ref => ref.limitToLast(limitResults + 1)
             .orderBy('timestamp').endAt(endAt)).get();
        }
     } else {
         if (p === 1) {
             return this.af.collection('requests', ref => ref.limitToLast(limitResults + 1)
                 .orderBy('timestamp').where('city', '==', cityOrMain)).get();
         } else {
             return this.af.collection('requests', ref => ref.limitToLast(limitResults + 1)
                 .orderBy('timestamp').where('city', '==', cityOrMain).endAt(endAt)).get();
         }
     }
 }

    readRequestDataRealTime() {
                return this.af.collection('requests', ref => ref.limitToLast(1)
                    .orderBy('timestamp'));
    }


    readRequestDataMy(userUid, limitResults, p, endAt?) {
            if (p === 1) {
                return this.af.collection('requests', ref => ref.limitToLast(limitResults + 1)
                    .orderBy('timestamp').where('ownerId' , '==' , userUid )).get();
            } else {
                return this.af.collection('requests', ref => ref.limitToLast(limitResults + 1)
                    .orderBy('timestamp').where('ownerId' , '==' , userUid ).endAt(endAt)).get();
            }
    }

    readRequestDataRefresh(cityOrMain: string, limitResults, startAt?) {
        if (cityOrMain === 'Main') {
                return this.af.collection('requests', ref => ref.limitToLast(limitResults + 1)
                    .orderBy('timestamp').startAt(startAt)).get();
        } else {
                return this.af.collection('requests', ref => ref.limitToLast(limitResults + 1)
                    .orderBy('timestamp').where('city', '==', cityOrMain).startAt(startAt)).get();
        }
    }

    readRequestDataRefreshMy(userUid, limitResults, startAt?) {
            return this.af.collection('requests', ref => ref.limitToLast(limitResults + 1)
                .orderBy('timestamp').where('ownerId', '==', userUid).startAt(startAt)).get();
    }


    readMsgData(reqRef, limitReadMsg, timeStamp) {
       // return  this.rtdb.object('/messages/' + reqRef);
        return this.rtdb.list('/messages/' + reqRef, ref => ref.limitToLast(limitReadMsg)
            .orderByChild('timestamp').startAt(timeStamp));
    }

    updateMsgSubscription(userUid, reqRef, data) {
        return this.rtdb.object('/msgSub/' + userUid + '/' + reqRef).set(data);
    }

    getMsgSubscription(userUid) {
        return this.rtdb.list('/msgSub/' + userUid);
    }

    updateMessageData(reqRef, msgRef, message) {
        return this.rtdb.object('/messages/' + reqRef + '/' + msgRef).update(message);
    }

    updateUserMessages(userUid, msgRef, message) {
     return this.rtdb.object('/users/' + userUid + '/messages/' + msgRef).update(message);
    }

    getTimeStampFb() {
        return firestore.FieldValue.serverTimestamp();
       //  return FieldValue.serverTimestamp();
     //return database.ServerValue.TIMESTAMP;
      //  return firebase.database.ServerValue.TIMESTAMP;
    }

    getTimeStampRtdb() {
        return database.ServerValue.TIMESTAMP;
    }

    getUserName(userUid) {
        return this.af.collection('username', ref => ref.where(
            'uid', '==' , userUid));
       // return this.rtdb.object('/login/' + userUid);
    }

    checkUserName(userName) {
        return this.af.collection('username', ref => ref.where(
            'username', '==', userName));
    }

    setUserName(userData) {
        return this.af.collection('username').doc(userData.uid).set(userData);
    }


}
