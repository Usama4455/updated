import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{
  // path: '',
  //redirectTo: 'home',
  // pathMatch: 'full'
  //},
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },

  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },

  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'login-phone', loadChildren: './modals/login-phone/login-phone.module#LoginPhonePageModule' },
  { path: 'update-profile', loadChildren: './modals/update-profile/update-profile.module#UpdateProfilePageModule' },
  { path: 'first-page', loadChildren: './first-page/first-page.module#FirstPagePageModule' },
  {
    path: 'login-email',
    loadChildren: () => import('./modals/login-email/login-email.module').then( m => m.LoginEmailPageModule)
  },

  {
    path: 'new-request',
    loadChildren: () => import('./new-request/new-request.module').then( m => m.NewRequestPageModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
  },
  {
    path: 'my-requests',
    loadChildren: () => import('./my-requests/my-requests.module').then( m => m.MyRequestsPageModule)
  },
  {
    path: 'my-chats',
    loadChildren: () => import('./my-chats/my-chats.module').then( m => m.MyChatsPageModule)
  },
  {
    path: 'user-name',
    loadChildren: () => import('./modals/user-name/user-name.module').then( m => m.UserNamePageModule)
  },
  {
    path: 'rec-audio',
    loadChildren: () => import('./modals/rec-audio/rec-audio.module').then( m => m.RecAudioPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
