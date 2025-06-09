import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-add-user-dialog',
  template: `
    <h2 mat-dialog-title>Add New User</h2>
    <mat-dialog-content>
      <form #userForm="ngForm" style="display: flex; flex-direction: column; gap: 1rem;">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="userData.name" name="name" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="userData.username" name="username" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput type="password" [(ngModel)]="userData.password" name="password" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput [(ngModel)]="userData.phone" name="phone" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="userData.email" name="email" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <input matInput [(ngModel)]="userData.role" name="role" required />
        </mat-form-field>

        <input type="file" (change)="onFileSelected($event)" />
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-button color="primary" (click)="saveUser()" 
        [disabled]="!userData.name || !userData.username || !userData.password || !userData.phone || !userData.role">
        Add
      </button>
    </mat-dialog-actions>
  `,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AddUserDialogComponent {
  userData: any = {
    name: '',
    username: '',
    password: '',
    phone: '',
    role: '',
    email: '',
    file: null,
  };

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.userData.file = input.files[0];
    }
  }

  saveUser(): void {
    this.dialogRef.close(this.userData);
  }
}
