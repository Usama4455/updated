import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {AuthGuard} from '../guards/auth.guard';


const routes: Routes = [
    {
      path: 'tabs',
      component: TabsPage,
      children:
        [
          {
            path: 'home',
            children:
              [
                {
                  path: '',
                  loadChildren: '../time-line/time-line.module#TimeLinePageModule',
                  canActivate: [AuthGuard],
                }
              ]
          },
          {
            path: 'my-requests',
            children:
              [
                {
                  path: '',
                    loadChildren: '../my-requests/my-requests.module#MyRequestsPageModule',
                }
              ]
          },
            {
                path: 'my-chats',
                children:
                    [
                        {
                            path: '',
                            loadChildren: '../my-chats/my-chats.module#MyChatsPageModule',
                        }
                    ]
            },
            {
                path: 'settings',
                children:
                    [
                        {
                            path: '',
                            loadChildren: '../settings/settings.module#SettingsPageModule',
                        }
                    ]
            },
          {
            path: '',
            redirectTo: '/tabs/home',
            pathMatch: 'full'
          }
        ]
    },

    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    },

  ];


  @NgModule({
    imports:
      [
        RouterModule.forChild(routes)
      ],
    exports:
      [
        RouterModule
      ]
  })
  export class TabsPageRoutingModule {}
