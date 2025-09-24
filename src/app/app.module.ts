import { APP_INITIALIZER, importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TaskExecutionComponent } from './task-execution/task-execution.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LOCAL_STORE_TASK, LOCAL_STORE_TASK_CHANGES, REMOTE_STORE_TASK, REMOTE_STORE_TASK_CHANGES, taskSchema } from './local-database-definitions';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { BarcodeScannerComponent } from './barcode-scanner/barcode-scanner.component';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatTabsModule} from '@angular/material/tabs';
import { QrGeneratorComponent } from './qr-generator-component/qr-generator-component.component';
import { TaskListComponent } from "./tasks/list/task-list.component";
import { TaskComponent2 } from './tasks/task/task.component';
import { AdhocTaskComponent } from './tasks/adhoc/adhoc-task/adhoc-task.component';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth/auth.config';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';

const dbConfig: DBConfig = {
  name: 'ControlDB',
  version: 1,
  objectStoresMeta: [{
    store: LOCAL_STORE_TASK,
    storeConfig: { keyPath: 'id', autoIncrement: false },
    storeSchema: taskSchema
  },
  {
    store: LOCAL_STORE_TASK_CHANGES,
    storeConfig: { keyPath: 'id', autoIncrement: false },
    storeSchema: taskSchema
  },
  {
    store: REMOTE_STORE_TASK,
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: taskSchema
  },
  {
    store: REMOTE_STORE_TASK_CHANGES,
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: taskSchema
  }
]

};

export function initializeAuth(oauthService: OAuthService): () => Promise<void> {
  return async () => {
    oauthService.configure(authConfig);
    await oauthService.loadDiscoveryDocumentAndTryLogin();
    oauthService.setupAutomaticSilentRefresh();
    // Auto login if no valid token
    if (!oauthService.hasValidAccessToken()) {
      console.log("initCodeFlow");
      oauthService.initCodeFlow();
    }
// 
    // console.log("hostname = " + window.location.hostname);
    // oauthService.configure(authConfig);
    // oauthService.setupAutomaticSilentRefresh(); // refresh tokens automatically

    // if (window.location.hostname === 'localhost') {
    //   console.log("Local flow");
    //   await oauthService.loadDiscoveryDocumentAndTryLogin();
    // } else {
    //   console.log("Production flow");
    //   oauthService.tokenEndpoint = `${authConfig.issuer}/oauth2/token`;
    //   oauthService.loginUrl = `${authConfig.issuer}/oauth2/authorize`;
    //   oauthService.logoutUrl = `${authConfig.issuer}/logout`;
    //   await oauthService.tryLoginCodeFlow();
    // }

  };
}

@NgModule({
  declarations: [
    AppComponent,
    TaskExecutionComponent
  ],
  exports: [QrGeneratorComponent],
  imports: [
    AppRoutingModule,
    OAuthModule.forRoot(),
    BrowserModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatGridListModule,
    MatTabsModule,
    QrGeneratorComponent,
    NgxIndexedDBModule.forRoot(dbConfig),
    ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production
    }),
    TaskListComponent,
    TaskComponent2,
    AdhocTaskComponent,
    BarcodeScannerComponent
],
  providers: [
    provideHttpClient(),
    importProvidersFrom(OAuthModule.forRoot()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [OAuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
