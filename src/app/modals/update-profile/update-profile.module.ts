import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UpdateProfilePage } from './update-profile.page';
import {PipesModule} from '../../../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: UpdateProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [UpdateProfilePage]
})
export class UpdateProfilePageModule {}
