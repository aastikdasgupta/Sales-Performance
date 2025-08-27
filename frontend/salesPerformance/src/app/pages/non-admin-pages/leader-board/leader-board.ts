import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '../../../shared/material-module/material-module';
import { CommonModule } from '@angular/common';
import { BACKEND_IP } from '../../../constant';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leader-board.html',
  styleUrls: ['./leader-board.scss'],
  standalone: true,
  imports: [MaterialModule, CommonModule],
})
export class Leaderboard implements OnInit {
  role: string = '';
  leaderboards: any = {};
  selectedMonth: string = '';
  availableMonths: string[] = [];

  constructor(private http: HttpClient) {}

  metricOrder: string[] = [];

ngOnInit(): void {
  this.http.get<any>(BACKEND_IP + 'leaderboard').subscribe({
    next: (res: any) => {
      this.role = res.role;
      this.leaderboards = res.leaderboards;
      this.availableMonths = Object.keys(this.leaderboards);
      this.selectedMonth = this.availableMonths[0];

      // ✅ Extract metric order from first entry with data
      for (const month of this.availableMonths) {
        const monthData = this.leaderboards[month];
        if (monthData && monthData.length > 0) {
          this.metricOrder = Object.keys(monthData[0].metrics);
          break;
        }
      }
    },
    error: (err: any) => {
      console.error('Failed to load leaderboard:', err);
    }
  });
}

  selectMonth(month: string): void {
    this.selectedMonth = month;
  }

  getMonthLabel(monthKey: string): string {
    const date = new Date(`01 ${monthKey} ${new Date().getFullYear()}`);
    if (isNaN(date.getTime())) {
      return monthKey; // fallback to original if date is invalid
    }
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

  // ✅ Template-safe helper to prevent type errors
  castKeyToString(key: unknown): string {
    return String(key);
  }
}
