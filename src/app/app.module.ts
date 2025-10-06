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
import { TaskComponent } from './tasks/task/task.component';
import { AdhocTaskComponent } from './tasks/adhoc/adhoc-task/adhoc-task.component';
import { OAuthEvent, OAuthModule, OAuthService, OAuthSuccessEvent } from 'angular-oauth2-oidc';
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
    await oauthService.loadDiscoveryDocument();



oauthService.events.subscribe((e: OAuthEvent) => {
  switch (e.type) {
    case 'token_received':
      console.log('New tokens received (login or refresh).');
      break;

    case 'token_refreshed':
      console.log('Access token was refreshed:',
                  (e as OAuthSuccessEvent).info);
      break;

    case 'token_expires':
      console.log('Token is about to expire, scheduling refresh...');
      break;
  }
});

    // Very important: this processes the redirect callback
    await oauthService.tryLoginCodeFlow();
    oauthService.setupAutomaticSilentRefresh();
    // Auto login if no valid token
    if (!oauthService.hasValidAccessToken()) {
      console.log("initCodeFlow");
      oauthService.initCodeFlow();
    }
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
    TaskComponent,
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
