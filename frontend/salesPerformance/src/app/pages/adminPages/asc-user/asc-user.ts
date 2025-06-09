import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material-module/material-module';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AddUserDialogComponent } from '../../../services/add-user'; // Adjust path if needed

@Component({
  selector: 'app-asc-user',
  templateUrl: './asc-user.html',
  styleUrls: ['./asc-user.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class AscUser implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'phone', 'actions'];

  profile: any = null;
  roleToUse: string | null = null;
  check: string | null = null;

  selectedFile: File | null = null;
  searchText: string = '';
  error: string = '';

  editingUser: any = null;

  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.roleToUse = sessionStorage.getItem('temp_role') || sessionStorage.getItem('sp_role');
    this.check = sessionStorage.getItem('temp_role');

    console.log('Role used for AscUser:', this.roleToUse);
    console.log('temp_role:', this.check);

    if (!this.roleToUse) {
      this.error = 'No role found in session storage';
      return;
    }

    this.getUserProfile();
    this.loadUsersByRole(this.roleToUse);
  }

  private getTokenHeader(): { headers: HttpHeaders } {
    const token = localStorage.getItem('access_token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getUserProfile(): void {
    this.http.get('/user/profile/', this.getTokenHeader()).subscribe({
      next: (res: any) => {
        this.profile = res;
      },
      error: (err: any) => {
        this.error = 'Failed to load profile';
        console.error(err);
      },
    });
  }

  loadUsersByRole(role: string): void {
    const roleLower = role.toLowerCase();
    const url = `http://localhost:8000/user/profile/list-by-role?role=${roleLower}`;
    console.log('Final API URL:', url);

    this.http.get(url, this.getTokenHeader()).subscribe({
      next: (res: any) => {
        this.users = res.users || res;
        this.applyFilter();
      },
      error: (err: any) => {
        this.error = 'Failed to load users';
        console.error('Error fetching users:', err);
      },
    });
  }

  applyFilter(): void {
    if (!this.searchText) {
      this.filteredUsers = this.users.slice();
      return;
    }

    const filter = this.searchText.toLowerCase();
    this.filteredUsers = this.users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(filter)) ||
        (u.email && u.email.toLowerCase().includes(filter))
    );
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  uploadIncentive(): void {
    if (!this.selectedFile || !this.roleToUse) {
      this.error = 'Please upload a file and ensure role is set';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('role', this.roleToUse);

    this.http.post('/user/incentive/upload', formData, this.getTokenHeader()).subscribe({
      next: () => {
        this.error = '';
        alert('Incentive uploaded successfully');
        this.selectedFile = null;
      },
      error: (err: any) => {
        this.error = 'Failed to upload incentive';
        console.error(err);
      },
    });
  }

  addUser(payload: {
    name: string;
    username: string;
    password: string;
    role: string;
    phone: string;
    email?: string;
    file?: File;
  }): void {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('username', payload.username);
    formData.append('password', payload.password);
    formData.append('role', payload.role);
    formData.append('phone', payload.phone);
    if (payload.email) formData.append('email', payload.email);
    if (payload.file) formData.append('file', payload.file);

    this.http.post('/user/profile/add', formData, this.getTokenHeader()).subscribe({
      next: () => this.loadUsersByRole(this.roleToUse!),
      error: (err: any) => {
        this.error = 'Failed to add user';
        console.error(err);
      },
    });
  }

  updateUserByAdmin(payload: {
    id: number;
    name?: string;
    phone?: string;
    email?: string;
    role?: string;
    file?: File;
  }): void {
    const formData = new FormData();
    formData.append('id', payload.id.toString());
    if (payload.name) formData.append('name', payload.name);
    if (payload.phone) formData.append('phone', payload.phone);
    if (payload.email) formData.append('email', payload.email);
    if (payload.role) formData.append('role', payload.role);
    if (payload.file) formData.append('file', payload.file);

    this.http.put('/user/profile/admin', formData, this.getTokenHeader()).subscribe({
      next: () => this.loadUsersByRole(this.roleToUse!),
      error: (err: any) => {
        this.error = 'Admin update failed';
        console.error(err);
      },
    });
  }

  deleteUser(user: any): void {
    const id = user.id || user._id || 0;
    if (!id) return;

    const formData = new FormData();
    formData.append('id', id.toString());

    this.http
      .delete('/user/profile/delete', {
        headers: this.getTokenHeader().headers,
        body: formData,
      })
      .subscribe({
        next: () => this.loadUsersByRole(this.roleToUse!),
        error: (err: any) => {
          this.error = 'Failed to delete user';
          console.error(err);
        },
      });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      data: {
        role: this.roleToUse
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addUser(result);
      }
    });
  }

  editUser(user: any): void {
    this.editingUser = user;

    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      data: { ...user, isEdit: true }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateUserByAdmin({ id: user.id, ...result });
      }
    });
  }
}
