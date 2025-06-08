import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material-module/material-module';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAuthentication } from '../../services/user-authentication';
import { BACKEND_IP } from '../../constant';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,FormsModule,MaterialModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username: string = '';
  password: string = '';
  selectedRole: string = '';
  private _snackBar = inject(MatSnackBar);
  constructor(private http: HttpClient, private router:Router, private authService:UserAuthentication) {}
  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    console.log('Selected Role:', this.selectedRole);
    const payload = {
      phone: this.username,
      password: this.password,
      role: this.selectedRole
    };
    this.http.post(BACKEND_IP + 'login', payload).subscribe({
      next: (response:any) => {
        console.log('Login successful:', response);
        const accessToken = response.access_token;
        if (accessToken) {
          // Store the access token in sessionStorage
          //TODO - Use the UserAuthentication service to manage access token and user role
          sessionStorage.setItem('access_token', accessToken);
          sessionStorage.setItem('sp_role', this.selectedRole);
          this.authService.setAccessDetails(accessToken,this.selectedRole);
        }
        if(this.selectedRole !== 'Admin') {
          this.router.navigate(['home/user/dashboard']); // Navigate to the dashboard after successful login
        }
        else{
          this.router.navigate(['home/admin/upload']); // Navigate to the ASC page for Admin role
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}