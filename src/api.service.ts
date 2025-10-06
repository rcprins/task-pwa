import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './app/auth/authentication-service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  async getUsers() {

    const token = this.auth.getAccessToken();
    return this.http.get('https://angular-ui-api.automation-dev.digi-steel-app.com/api/admin/getroles', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })
    }).toPromise();
  }
}
