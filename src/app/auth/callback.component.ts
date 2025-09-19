// src/app/callback/callback.component.ts
import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-callback',
  standalone: true,         // ✅ standalone component
  imports: [CommonModule],  // import CommonModule for ngIf, etc.
  template: '<p>Logging in, please wait...</p>'
})
export class CallbackComponent implements OnInit {

  constructor(private oauthService: OAuthService) {}

  ngOnInit(): void {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      window.location.href = '/';
    }).catch(err => {
      console.error('OAuth callback error:', err);
    });
  }
}
