import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Leaderboard } from './leader-board/leader-board';
import {UserProfileComponent} from './user-profile/user-profile';

const routes: Routes = [
  {
    path: 'dashboard',
    component:Dashboard
  },
  {
    path:'leaderboard',
    component:Leaderboard
  },
  {
    path:'profile',
    component:UserProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonAdminPagesRoutingModule { }
