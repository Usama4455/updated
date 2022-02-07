import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecAudioPageRoutingModule } from './rec-audio-routing.module';

import { RecAudioPage } from './rec-audio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecAudioPageRoutingModule
  ],
  declarations: [RecAudioPage]
})
export class RecAudioPageModule {}
