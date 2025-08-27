import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material-module/material-module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BACKEND_IP } from '../../../constant';

@Component({
  selector: 'app-control-log',
  templateUrl: './control-log.html',
  styleUrls: ['./control-log.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, MatPaginatorModule],
})
export class ControlLog implements OnInit {
  logForm!: FormGroup;

  logs: any[] = [];
  filteredLogs: any[] = [];
  paginatedLogs: any[] = [];

  errorMessage: string | null = null;
  loading: boolean = false;

  displayedColumns: string[] = [
    'id',
    'user_id',
    'username',
    'login_time',
    'ip_address',
    'user_agent',
    'actions'
  ];

  searchText: string = '';
  pageSize = 10;
  currentPage = 0;

  private http = inject(HttpClient);
  private _snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.logForm = this.fb.group({
      selectedDate: ['', Validators.required],
    });
  }

  private getTokenHeader(): { headers: HttpHeaders } {
    const token = sessionStorage.getItem('access_token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  fetchLogs(): void {
    if (!this.logForm.valid) return;

    this.loading = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('date', this.logForm.value.selectedDate);

    this.http.post(BACKEND_IP + 'log', formData, this.getTokenHeader()).subscribe({
      next: (res: any) => {
        this.logs = res.logs || res;
        this.applyFilter();
        this.loading = false;
        this._snackBar.open('Logs fetched successfully', 'Close', { duration: 2000 });
      },
      error: (err: any) => {
        this.logs = [];
        this.loading = false;
        this.errorMessage = err.error?.detail || 'Failed to load control logs';
        this._snackBar.open(this.errorMessage || 'Something went wrong', 'Close', { duration: 3000 });
        console.error('Error fetching logs:', err);
      },
    });
  }

  applyFilter(): void {
    const filter = this.searchText.toLowerCase();

    if (!filter) {
      this.filteredLogs = [...this.logs];
    } else {
      this.filteredLogs = this.logs.filter(
        (log) =>
          (log.username && log.username.toLowerCase().includes(filter)) ||
          (log.ip_address && log.ip_address.toLowerCase().includes(filter)) ||
          (log.user_agent && log.user_agent.toLowerCase().includes(filter))
      );
    }

    this.currentPage = 0;
    this.updatePaginatedLogs();
  }

  updatePaginatedLogs(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedLogs = this.filteredLogs.slice(startIndex, endIndex);
  }

  onPageChange(pageIndex: number): void {
    this.currentPage = pageIndex;
    this.updatePaginatedLogs();
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  onDateSubmit(): void {
    this.fetchLogs();
  }
}
