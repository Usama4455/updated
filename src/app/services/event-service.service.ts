import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {
 deepLinkService = new Subject();
 subCategoryService = new Subject();
 settingsLoadedService = new Subject();

    constructor() { }

  publishDeepLinkService() {
    this.deepLinkService.next();
  }


  publishSubCategoryService() {
    this.subCategoryService.next();
  }

}
