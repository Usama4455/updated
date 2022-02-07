import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewRequestPageRoutingModule } from './new-request-routing.module';

import { NewRequestPage } from './new-request.page';
import {DisplayMsgImagesComponent} from '../../components/display-msg-images/display-msg-images.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewRequestPageRoutingModule
  ],
    declarations: [NewRequestPage, DisplayMsgImagesComponent]
})
export class NewRequestPageModule {}
