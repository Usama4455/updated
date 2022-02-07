import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserNamePageRoutingModule } from './user-name-routing.module';

import { UserNamePage } from './user-name.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserNamePageRoutingModule
  ],
  declarations: [UserNamePage]
})
export class UserNamePageModule {}
