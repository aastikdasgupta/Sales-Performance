import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '../../../shared/material-module/material-module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [MaterialModule, CommonModule, FormsModule],
})
export class DtrDashboard implements OnInit {
  isDataLoaded = false;

  // Editable column metadata
  displayedColumnsMeta = [
    { key: 'month', header: 'Month' },
    { key: 'gross', header: 'Gross Activations' },
    { key: 'mnp', header: 'MNP Count' },
    { key: 'trade_gross', header: 'Trade Gross' },
    { key: 'trade_mnp', header: 'Trade MNP' },
    { key: 'ds', header: 'DS Count' },
    { key: 'pipo', header: 'PIPO' },
    { key: 'fwa', header: 'FWA' },
    { key: '5g_site', header: '5G Visits' }
  ];
  get displayedColumns(): string[] {
    return this.displayedColumnsMeta.map(col => col.key);
  }

  hygieneDisplayedColumnsMeta = [
    { key: 'month', header: 'Month' },
    { key: 'asc_norms', header: 'ASC Norms' },
    { key: 'gt_sso', header: 'GT SSO' },
    { key: 'dsso', header: 'DSSO' },
    { key: 'mdsso', header: 'MDSSO' },
    { key: 'sim_billing', header: 'SIM Billing' },
    { key: 'jmnp_auto', header: 'JMNP Auto' },
    { key: 'tgt_act_4g', header: 'Target 4G Activations' }
  ];
  get hygieneDisplayedColumns(): string[] {
    return this.hygieneDisplayedColumnsMeta.map(col => col.key);
  }

  incentiveDisplayedColumns = ['month', 'tdp_earned', 'pli_slab', 'total_earning', 'rank'];

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
      this.dataSource = response.performance || [];

      this.hygieneDataSource = response.hygiene || [];

      this.incentiveDataSource = response.incentive_performance.map((entry: any) => ({
        month: entry.month,
        tdp_earned: entry.tdp_earned ?? 0,
        pli_slab: entry.pli_slab ?? '-',
        total_earning: entry.total_earning ?? 0,
        rank: entry.rank !== null && entry.rank !== undefined ? entry.rank : 'N/A',
      }));

      this.incentiveSchemeUrl = response.incentive_scheme
        ? `${BACKEND_IP}${response.incentive_scheme.replace(/^app\//, '')}`
        : null;

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
