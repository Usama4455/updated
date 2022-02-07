import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserNamePage } from './user-name.page';

const routes: Routes = [
  {
    path: '',
    component: UserNamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserNamePageRoutingModule {}
