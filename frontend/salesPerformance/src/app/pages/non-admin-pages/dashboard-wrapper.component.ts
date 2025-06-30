import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AscDashboard } from './dashboard/asc_dashboard';
import { DtrDashboard } from './dashboard/dtr_dashboard';

@Component({
  selector: 'app-dashboard-wrapper',
  template: `
    <ng-container [ngSwitch]="role">
      <app-asc-dashboard *ngSwitchCase="'asc'"></app-asc-dashboard>
      <app-dtr-dashboard *ngSwitchCase="'dtr'"></app-dtr-dashboard>

      <!-- Optional: Handle unexpected roles -->
      <!-- <div *ngSwitchDefault>Invalid role or no dashboard available.</div> -->
    </ng-container>
  `,
  standalone: true,
  imports: [CommonModule, AscDashboard, DtrDashboard]
})
export class DashboardWrapperComponent {
  role: string | null = null;

  ngOnInit() {
    this.role = sessionStorage.getItem('temp_role');
  }
}