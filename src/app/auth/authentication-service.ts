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

    // if (window.location.hostname === 'localhost') {
    //   console.log("Local flow");
    //   await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    // } else {
    //   console.log("Production flow");
    //   this.oauthService.tokenEndpoint = `${authConfig.issuer}/oauth2/token`;
    //   this.oauthService.loginUrl = `${authConfig.issuer}/oauth2/authorize`;
    //   this.oauthService.logoutUrl = `${authConfig.issuer}/logout`;
    //   this.oauthService.tryLoginCodeFlow();
    // }
  }

  private async startFlow() {
    debugger;
    if (window.location.hostname === 'localhost') {
      console.log("Local flow");
           this.oauthService.tokenEndpoint = `${authConfig.issuer}/oauth2/token`;
      this.oauthService.loginUrl = `${authConfig.issuer}/oauth2/authorize`;
      this.oauthService.logoutUrl = `${authConfig.issuer}/logout`;
      // await this.oauthService.tryLoginCodeFlow();
      // await this.oauthService.loadDiscoveryDocumentAndTryLogin();
         this.oauthService.initLoginFlow(); // redirects to Keycloak
    } else {
      console.log("Production flow");
      this.oauthService.tokenEndpoint = `${authConfig.issuer}/oauth2/token`;
      this.oauthService.loginUrl = `${authConfig.issuer}/oauth2/authorize`;
      this.oauthService.logoutUrl = `${authConfig.issuer}/logout`;
      await this.oauthService.tryLoginCodeFlow();
    }
  }

  login() {
    // this.oauthService.initLoginFlow(); // redirects to Keycloak
    this.startFlow();
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
