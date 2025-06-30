import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '../../../shared/material-module/material-module';
import { CommonModule } from '@angular/common';
import { BACKEND_IP } from '../../../constant';

interface PerformanceData {
  month: string;
  gross?: number;
  mnp?: number;
  trade_gross?: number;
  trade_mnp?: number;
  ds?: number;
  pipo?: number;
  fwa?: number;
  visits_5g?: number;
}

interface HygieneData {
  month: string;
  asc_norms?: string;
  gt_sso?: string;
  dsso?: string;
  mdsso?: string;
  sim_billing?: string;
  jmnp_auto?: string;
  tgt_act_4g?: string;
}

interface IncentivePerformance {
  month: string;
  tdp_earned?: number;
  pli_slab?: string;
  total_earning?: number;
  rank?: number | string;
}

@Component({
  selector: 'app-dtr-dashboard',
  templateUrl: './dtr_dashboard.html',
  styleUrls: ['./dtr_dashboard.scss'],
  standalone: true,
  imports: [MaterialModule, CommonModule],
})
export class DtrDashboard implements OnInit {
  isDataLoaded = false;

  // Display columns
  displayedColumns: string[] = [
    'month', 'gross', 'mnp', 'trade_gross', 'trade_mnp', 'ds', 'pipo', 'fwa', 'visits_5g'
  ];
  hygieneDisplayedColumns: string[] = [
    'month', 'asc_norms', 'gt_sso', 'dsso', 'mdsso', 'sim_billing', 'jmnp_auto', 'tgt_act_4g'
  ];
  incentiveDisplayedColumns: string[] = ['month', 'tdp_earned', 'pli_slab', 'total_earning', 'rank'];

  // Data sources
  dataSource: PerformanceData[] = [];
  hygieneDataSource: HygieneData[] = [];
  incentiveDataSource: IncentivePerformance[] = [];

  // Profile info
  incentiveSchemeUrl: string | null = null;
  showIncentiveScheme = false;

  zone: string | null = null;
  distributor: string | null = null;
  tsm: string | null = null;
  zsm: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.isDataLoaded = false;

    this.http.get<any>(BACKEND_IP + 'dashboard').subscribe((response: any) => {
      // Performance
      this.dataSource = response.performance;

      // Hygiene
      this.hygieneDataSource = response.hygiene || [];

      // Incentives
      this.incentiveDataSource = response.incentive_performance.map((entry: any) => ({
        month: entry.month,
        tdp_earned: entry.tdp_earned ?? 0,
        pli_slab: entry.pli_slab ?? '-',
        total_earning: entry.total_earning ?? 0,
        rank: entry.rank !== null && entry.rank !== undefined ? entry.rank : 'N/A',
      }));

      // Incentive PDF URL
      this.incentiveSchemeUrl = response.incentive_scheme
        ? `${BACKEND_IP}${response.incentive_scheme.replace(/^app\//, '')}`
        : null;

      // Profile Info
      this.zone = response.zone ?? null;
      this.distributor = response.distributor ?? null;
      this.tsm = response.tsm ?? null;
      this.zsm = response.zsm ?? null;

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