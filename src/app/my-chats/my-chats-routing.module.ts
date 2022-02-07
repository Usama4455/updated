import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyChatsPage } from './my-chats.page';

const routes: Routes = [
  {
    path: '',
    component: MyChatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyChatsPageRoutingModule {}
