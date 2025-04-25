import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TaskComponent } from './tasks/tasks.component';
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
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import { QrGeneratorComponent } from './qr-generator-component/qr-generator-component.component';

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

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    TaskExecutionComponent,
    BarcodeScannerComponent
  ],
  exports: [QrGeneratorComponent],
  imports: [
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
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
