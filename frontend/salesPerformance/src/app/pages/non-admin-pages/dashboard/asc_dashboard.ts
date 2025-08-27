import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '../../../shared/material-module/material-module';
import { CommonModule } from '@angular/common';
import { BACKEND_IP } from '../../../constant';

interface PerformanceData {
  month: string;
  fwa: number | string;
  mnp: number | string;
  jmnp: number | string;
  mdsso: number | string;
  simBilling: number | string;
  threeMnp: number | string;   // for "3mnp"
  mnpTgtAct: number | string;  // for "mnp_tgt_act"
}

@Component({
  selector: 'app-asc-dashboard',
  templateUrl: './asc_dashboard.html',
  styleUrls: ['./asc_dashboard.scss'],
  standalone: true,
  imports: [MaterialModule, CommonModule],
})
export class AscDashboard implements OnInit {
  isDataLoaded: boolean = false;

  displayedColumns: string[] = [
    'month',
    'mnp',
    'jmnp',
    'mdsso',
    'fwa',
    'simBilling',
    'threeMnp',
    'mnpTgtAct'
  ];
  dataSource: PerformanceData[] = [];

  rankingDisplayedColumns: string[] = [];
  rankingRow: { [month: string]: number | string } = {};

  incentiveDisplayedColumns: string[] = [];
  incentiveRow: { [month: string]: number | string } = {};

  incentiveSchemeUrl: string | null = null;
  showIncentiveScheme: boolean = false;

  zone: string | null = null;
  distributor: string | null = null;
  tsm: string | null = null;
  zsm: string | null = null;

  dashboardMessage: string | null = null;  // 👈 NEW FIELD

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.isDataLoaded = false;

    this.http.get<any>(BACKEND_IP + 'dashboard').subscribe((response: any) => {

      // Performance data
      this.dataSource = response.performance.map((entry: any) => ({
        month: entry.month,
        fwa: entry.fwa,
        mnp: entry.mnp,
        jmnp: entry.jmnp,
        mdsso: entry.mdsso,
        simBilling: entry.sim_billing,
        threeMnp: entry['3mnp'],
        mnpTgtAct: entry['mnp_tgt_act']
      }));

      // Ranking data - from incentive_performance
      this.rankingDisplayedColumns = response.incentive_performance.map((entry: any) => entry.month);
      response.incentive_performance.forEach((entry: any) => {
        this.rankingRow[entry.month] = entry.rank !== null ? entry.rank : 'N/A';
      });

      // Incentive data - from incentive_performance
      this.incentiveDisplayedColumns = response.incentive_performance.map((entry: any) => entry.month);
      response.incentive_performance.forEach((entry: any) => {
        this.incentiveRow[entry.month] = entry.incentive !== undefined ? entry.incentive : 0;
      });

      // Incentive scheme URL
      this.incentiveSchemeUrl = response.incentive_scheme
        ? `${BACKEND_IP}${response.incentive_scheme.replace(/^app\//, '')}`
        : null;

      // Profile info
      this.zone = response.zone ?? null;
      this.distributor = response.distributor ?? null;
      this.tsm = response.tsm ?? null;
      this.zsm = response.zsm ?? null;

      // 📌 Message data
      this.dashboardMessage = response.message ?? null;

      this.isDataLoaded = true;
    });
  }

  viewIncentiveScheme(): void {
    if (this.incentiveSchemeUrl) {
      this.showIncentiveScheme = !this.showIncentiveScheme;
    } else {
      alert('Incentive scheme not available for this month.');
    }
  }
}