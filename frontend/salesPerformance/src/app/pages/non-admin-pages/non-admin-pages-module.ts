import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonAdminPagesRoutingModule } from './non-admin-pages-routing-module';

import { AscDashboard } from './dashboard/asc_dashboard';
import { DtrDashboard } from './dashboard/dtr_dashboard';
import { DashboardWrapperComponent } from './dashboard-wrapper.component';
import { Leaderboard } from './leader-board/leader-board';
import { UserProfileComponent } from './user-profile/user-profile';

@NgModule({
 
  imports: [
    CommonModule,
    NonAdminPagesRoutingModule,
    AscDashboard,
    DtrDashboard,
    DashboardWrapperComponent,
    Leaderboard,
    UserProfileComponent
  ]
})
export class NonAdminPagesModule { }