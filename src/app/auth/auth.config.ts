import { AuthConfig } from 'angular-oauth2-oidc';

// export const authConfig: AuthConfig = {
//   issuer: 'http://localhost:18080/realms/logicsteel',
//   redirectUri: 'http://localhost:4200/task-pwa/callback',
//   clientId: 'logicsteel-control',
//   responseType: 'code',
//   scope: 'openid email',
//   oidc: true,             // PKCE required for public clients
//   showDebugInformation: true // optional
// };


// export const authConfig: AuthConfig = {
//   issuer: 'https://digisteel-dev.auth.eu-west-1.amazoncognito.com',
//   redirectUri: 'https://rcprins.github.io/task-pwa/callback',
//   clientId: '3ucvl39e3v0d0knm7j1j6btci3',
//   responseType: 'code',
//   scope: 'openid email profile phone',
//   oidc: true,
//   showDebugInformation: true,
//   strictDiscoveryDocumentValidation: false, // Cognito sometimes needs this
// };
// debugger;
 export const authConfig: AuthConfig = (window.location.hostname == 'localhost') ?
{
  issuer: 'http://localhost:18080/realms/logicsteel',
  redirectUri: 'http://localhost:4200/task-pwa/callback',
  clientId: 'logicsteel-control',
  responseType: 'code',
  scope: 'openid email',
  oidc: true,             // PKCE required for public clients
  showDebugInformation: true // optional
} :
{
    issuer: 'https://digisteel-dev.auth.eu-west-1.amazoncognito.com',
    loginUrl: 'https://digisteel-dev.auth.eu-west-1.amazoncognito.com/oauth2/authorize',
    tokenEndpoint: 'https://digisteel-dev.auth.eu-west-1.amazoncognito.com/oauth2/token',
    userinfoEndpoint: 'https://digisteel-dev.auth.eu-west-1.amazoncognito.com/oauth2/userInfo',
    logoutUrl: 'https://digisteel-dev.auth.eu-west-1.amazoncognito.com/logout',
    redirectUri: 'https://rcprins.github.io/task-pwa/callback',
    clientId: '3ucvl39e3v0d0knm7j1j6btci3',
    responseType: 'code',
    scope: 'openid email',
    oidc: true,
    showDebugInformation: true,
  };
