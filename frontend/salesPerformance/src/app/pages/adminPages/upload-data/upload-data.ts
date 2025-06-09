import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material-module/material-module';

@Component({
  selector: 'app-upload-data',
  standalone: true, // Required when using 'imports' in component
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './upload-data.html',
  styleUrls: ['./upload-data.scss']
})
export class UploadData implements OnInit {
  uploadForm!: FormGroup;
  selectedFileName: string = '';
  private _snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      selectedDate: ['', Validators.required],
    });
  }

  @HostListener('drop', ['$event'])
  public fileDroppedEvent(event: any) {
    this.preventDefaultAndStopPropagation(event);
    const filesObj = event.target.files || event.dataTransfer.files;
    this.selectedFiles(filesObj);
  }

  clearSelection(val: any) {
    if (val.files && val.files.length > 0) {
      val.value = '';
    }
  }

  @HostListener('dragover', ['$event'])
  @HostListener('dragenter', ['$event'])
  @HostListener('dragleave', ['$event'])
  @HostListener('dragend', ['$event'])
  @HostListener('drag', ['$event'])
  @HostListener('dragstart', ['$event'])
  public preventDefaultAndStopPropagation(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  selectedFiles(filesObj: any) {
    const selectedFile = filesObj[0];
    this.uploadForm.patchValue({ file: selectedFile });
    this.uploadForm.get('file')?.updateValueAndValidity();
    this.selectedFileName = selectedFile.name;
    console.log('Selected File:', selectedFile);
  }

  uploadFile() {
    if (!this.uploadForm.valid) return;

    const formData = new FormData();
    formData.append('file', this.uploadForm.value.file);
    formData.append('date', this.uploadForm.value.selectedDate);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', BACKEND_IP + 'upload-excel', true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'));

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          this._snackBar.open(JSON.parse(xhr.responseText).message, 'Close', {
            duration: 3000,
          });
          this.uploadForm.reset();
          this.selectedFileName = '';
        } else {
          console.error('Error uploading file:', xhr.status, xhr.statusText);
        }
      }
    };

    xhr.send(formData);
  }
}
