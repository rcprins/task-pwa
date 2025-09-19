import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './app/auth/authentication-service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  async getData() {
    const token = this.auth.getAccessToken();
    return this.http.get('http://localhost:3000/data', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).toPromise();
  }
}
