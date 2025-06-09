import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,  // <-- mark as standalone
  imports: [         // <-- import needed modules here
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Hello</h2>
  <mat-dialog-content>This is a test dialog</mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button (click)="dialogRef.close()">Close</button>
  </mat-dialog-actions>
  `,
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
