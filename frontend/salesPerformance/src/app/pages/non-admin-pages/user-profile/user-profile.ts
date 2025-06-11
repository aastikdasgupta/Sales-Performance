// user-profile.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MaterialModule} from '../../../shared/material-module/material-module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BACKEND_IP } from '../../../constant';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss'],
  imports:[MaterialModule,CommonModule,FormsModule,ReactiveFormsModule]
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  profilePhoto: string | ArrayBuffer | null = null;
  editMode = false;
  originalPhotoPath = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }],
      alt_phone: [''],
      file: [null]
    });
  }

  ngOnInit(): void {
    this.http.get<any>(BACKEND_IP + 'user/profile/', { withCredentials: true }).subscribe({
      next: data => {
        this.profileForm.patchValue({
          name: data.name,
          phone: data.phone,
          alt_phone: data.alt_phone
        });
        this.originalPhotoPath = data.photo;
        this.profilePhoto = data.photo;
      },
      error: err => {
        console.error('Failed to load user profile', err);
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.profilePhoto = reader.result;
      reader.readAsDataURL(file);
      this.profileForm.patchValue({ file });
    }
  }

  saveChanges() {
    const formData = new FormData();
    if (this.profileForm.get('file')?.value) {
      formData.append('file', this.profileForm.get('file')?.value);
      this.http.put(BACKEND_IP + 'user/profile/photo', formData, { withCredentials: true })
        .subscribe({
          next: () => console.log('Photo updated'),
          error: err => console.error('Photo update failed', err)
        });
    }

    const altPhone = this.profileForm.get('alt_phone')?.value;
    if (altPhone) {
      this.http.put('http://15.207.14.26:8000/user/profile/admin', { alt_phone: altPhone }, { withCredentials: true })
        .subscribe({
          next: () => console.log('Alt phone updated'),
          error: err => console.error('Alt phone update failed', err)
        });
    }
    this.editMode = false;
  }

  cancelChanges() {
    this.ngOnInit();
    this.editMode = false;
  }

  enableEdit() {
    this.editMode = true;
  }
}