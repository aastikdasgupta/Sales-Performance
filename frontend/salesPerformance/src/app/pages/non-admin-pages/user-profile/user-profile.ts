import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/material-module/material-module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BACKEND_IP } from '../../../constant';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss'],
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class UserProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  profileForm: FormGroup;
  profilePhoto: string | ArrayBuffer | null = null;
  originalPhotoPath = '';
  selectedPhotoFile: File | null = null;

  isMobile = false;
  editAltPhone = false;
  photoEditMode = false;

  originalProfileData: any = {};

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }],
      alt_phone: [''],
      file: [null]
    });
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;

    this.http.get<any>(`${BACKEND_IP}show`, { withCredentials: true }).subscribe({
      next: data => {
        this.profileForm.patchValue({
          name: data.name,
          phone: data.phone,
          alt_phone: data.alt_phone
        });
        this.originalPhotoPath = data.photo;
        this.profilePhoto = data.photo;

        this.originalProfileData = {
          alt_phone: data.alt_phone
        };
      },
      error: err => {
        console.error('Failed to load user profile', err);
      }
    });
  }

  triggerPhotoChange(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhotoFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePhoto = reader.result;
        this.photoEditMode = true;
      };
      reader.readAsDataURL(file);
    }
  }

  savePhoto(): void {
    if (!this.selectedPhotoFile) return;

    const formData = new FormData();
    formData.append('photo', this.selectedPhotoFile);

    this.http.put(`${BACKEND_IP}photo`, formData, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.profilePhoto = res.photo;
        this.originalPhotoPath = res.photo;
        this.photoEditMode = false;
        this.selectedPhotoFile = null;
      },
      error: err => {
        console.error('Photo update failed', err);
      }
    });
  }

  toggleAltPhoneEdit(): void {
    this.editAltPhone = true;
  }

  saveAltPhone(): void {
    const altPhone = this.profileForm.get('alt_phone')?.value;
    const formData = new FormData();
    formData.append('alt_phone', altPhone);

    this.http.put(`${BACKEND_IP}alt-phone`, formData, { withCredentials: true }).subscribe({
      next: () => {
        this.originalProfileData.alt_phone = altPhone;
        this.editAltPhone = false;
      },
      error: err => {
        console.error('Alt phone update failed', err);
      }
    });
  }

  cancelChanges(): void {
    this.profileForm.patchValue({
      alt_phone: this.originalProfileData.alt_phone
    });
    this.editAltPhone = false;

    this.photoEditMode = false;
    this.selectedPhotoFile = null;
    this.profilePhoto = this.originalPhotoPath;
  }
}
