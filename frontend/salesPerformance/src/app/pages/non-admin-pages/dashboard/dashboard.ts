import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '../../../shared/material-module/material-module';
import { CommonModule } from '@angular/common';
import { BACKEND_IP } from '../../../constant';

interface PerformanceData {
  month: string;
  fwa: number;
  mnp: number;
  jioMnp: number;
  mdsso: number;
  simBilling: number;
}

interface RankingData {
  month: string;
  rank: number | null;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports:[MaterialModule,CommonModule],
})
export class Dashboard implements OnInit {
  isDataLoaded: boolean = false; // Track loading state
  displayedColumns: string[] = ['month', 'fwa', 'mnp', 'jmnp', 'mdsso', 'simBillings'];
  dataSource: PerformanceData[] = [];

  rankingDisplayedColumns: string[] = [];
  rankingRow: {[month: string]: number | string} = {};  // store ranks in a single row

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.isDataLoaded = false; // Initialize loading state
    this.http.get<any>(BACKEND_IP + 'dashboard').subscribe((response:any) => {
      this.dataSource = response.performance.map((entry: any) => ({
        month: entry.month,
        fwa: entry.fwa,
        mnp: entry.mnp,
        jioMnp: entry.jmnp,
        mdsso: entry.mdsso,
        simBilling: entry.sim_billing,
      }));

      this.rankingDisplayedColumns = response.performance.map((entry: any) => entry.month);

      // Create a single row object with month: rank (or N/A if rank is null)
      response.performance.forEach((entry: any) => {
        this.rankingRow[entry.month] = entry.rank !== null ? entry.rank : 'N/A';
      });
    });
    this.isDataLoaded = true;
  }

  viewIncentiveScheme(): void {
    // Add your logic here to view the incentive scheme
    alert("Incentive scheme feature coming soon!");
  }
}
