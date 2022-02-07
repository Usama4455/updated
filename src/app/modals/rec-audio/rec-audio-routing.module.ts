import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecAudioPage } from './rec-audio.page';

const routes: Routes = [
  {
    path: '',
    component: RecAudioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecAudioPageRoutingModule {}
