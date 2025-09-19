import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  private configure() {
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh(); // refresh tokens automatically
    this.oauthService.loadDiscoveryDocumentAndTryLogin(); // load endpoints & check login
  }

  login() {
    this.oauthService.initLoginFlow(); // redirects to Keycloak
  }

  logout() {
    this.oauthService.logOut();
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
