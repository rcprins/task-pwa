import { AuthConfig } from 'angular-oauth2-oidc';

 export const authConfig: AuthConfig = (window.location.hostname == 'localhost') ?
{
  // issuer: 'http://localhost:18080/realms/logicsteel',
  // redirectUri: 'http://localhost:4200/task-pwa/callback',
  // clientId: 'logicsteel-control',
  // responseType: 'code',
  // scope: 'openid email',
  // oidc: true,             // PKCE required for public clients
  // showDebugInformation: true, // optional
  // requireHttps: false
    issuer: 'http://localhost:18080/realms/logicsteel',
    loginUrl: 'http://localhost:18080/realms/logicsteel/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:18080/realms/logicsteel/protocol/openid-connect/token',
    userinfoEndpoint: 'http://localhost:18080/realms/logicsteel/protocol/openid-connect/userinfo',
    logoutUrl: 'http://localhost:18080/realms/logicsteel/protocol/openid-connect/logout',
    redirectUri: 'http://localhost:4200/task-pwa/callback',
    clientId: 'logicsteel-control',
    responseType: 'code',
    scope: 'openid email',
    oidc: true,
    showDebugInformation: true,
    requireHttps: false
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


    //   issuer: 'https://digisteel-dev.auth.eu-west-1.amazoncognito.com',
    // loginUrl: 'https://digisteel-dev.auth.eu-west-1.amazoncognito.com/oauth2/authorize',
    // tokenEndpoint: 'https://digisteel-dev.auth.eu-west-1.amazoncognito.com/oauth2/token',
    // userinfoEndpoint: 'https://digisteel-dev.auth.eu-west-1.amazoncognito.com/oauth2/userInfo',
    // logoutUrl: 'https://digisteel-dev.auth.eu-west-1.amazoncognito.com/logout',
    // redirectUri: 'https://rcprins.github.io/task-pwa/callback',
    // clientId: '3ucvl39e3v0d0knm7j1j6btci3',
    // responseType: 'code',
    // scope: 'openid email',
    // oidc: true,
    // showDebugInformation: true,