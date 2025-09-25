import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  private async configure() {
    console.log("hostname = " + window.location.hostname);
    this.oauthService.configure(authConfig);
       console.log("setupAutomaticSilentRefresh");
    this.oauthService.setupAutomaticSilentRefresh(); // refresh tokens automatically
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    const logoutUrl = authConfig.logoutUrl + `?client_id=${authConfig.clientId}` + `&logout_uri=${encodeURIComponent(window.location.origin+ '/task-pwa')}`;

    this.oauthService.logOut(false);

    window.location.href = logoutUrl;
  }

  getIdToken(): string | null {
    return this.oauthService.getIdToken();
  }

  getAccessToken(): string | null {
    return this.oauthService.getAccessToken();
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  getIdentityClaims(): any {
    return this.oauthService.getIdentityClaims();
  }
}
