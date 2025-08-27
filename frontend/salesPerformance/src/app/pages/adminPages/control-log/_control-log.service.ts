import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BACKEND_IP } from '../../../constant';

@Injectable({
  providedIn: 'root'
})
export class ControlLogService {
  private apiUrl = BACKEND_IP + `log`;

  constructor(private http: HttpClient) {}

  getLogs(date: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = new FormData();
    body.append('date', date);

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
