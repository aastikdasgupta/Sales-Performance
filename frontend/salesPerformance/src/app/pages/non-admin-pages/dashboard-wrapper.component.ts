import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AscDashboard } from './dashboard/asc_dashboard';
import { DtrDashboard } from './dashboard/dtr_dashboard';
import { UserAuthentication } from '../../services/user-authentication';

@Component({
  selector: 'app-dashboard-wrapper',
  template: `
    <ng-container [ngSwitch]="role">
      <app-asc-dashboard *ngSwitchCase="'asc'"></app-asc-dashboard>
      <app-dtr-dashboard *ngSwitchCase="'distributor'"></app-dtr-dashboard>

      <!-- Optional: Handle unexpected roles -->
      <div *ngSwitchDefault>No dashboard available for role: {{ role }}</div>
    </ng-container>
  `,
  standalone: true,
  imports: [CommonModule, AscDashboard, DtrDashboard]
})
export class DashboardWrapperComponent implements OnInit {
  role: string | null = null;

  ngOnInit() {
    // Fetch role from correct key in sessionStorage
    const savedRole = sessionStorage.getItem('sp_role');
    this.role = savedRole?.toLowerCase() ?? null; 
  }
}
