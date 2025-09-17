import { Injectable, HostListener, LOCALE_ID, NgZone } from '@angular/core';
import { DBConfig, NgxIndexedDBModule, NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Service } from '../../services/service';
import { Task } from '../../models/task.model';
import { Drawing } from './drawing.model';
import { v4 as uuidv4 } from 'uuid';

const dbConfig: DBConfig = {
  name: 'DrawingDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'files',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'type', keypath: 'type', options: { unique: false } },
        { name: 'size', keypath: 'size', options: { unique: false } },
        { name: 'file', keypath: 'file', options: { unique: false } }
      ]
    }
  ]
};



@Injectable({
  providedIn: 'root'
})
export class AssemblyDrawingService extends Service<Drawing> {


  private taskChanges$ = new BehaviorSubject<Task[] | undefined>(undefined);
 
  constructor() {
    super(new NgxIndexedDBService({ [dbConfig.name]: dbConfig },  window.indexedDB), "files");
  }

  override getAllRemote(): Observable<Drawing[]> {
    throw new Error('Method not implemented.');
  }
  override updateInBackend(localEntity: Drawing): void {
    throw new Error('Method not implemented.');
  }

  override getByIdRemote(id: string): Observable<Drawing> {
    const drawing = {} as Drawing;
    drawing.id = uuidv4();
    drawing.type = 'OBJ';
    drawing.name = 'Assembly drawing';
    drawing.size = ' 50 KB'
    drawing.file = 'blabalblae'
    return of(drawing) ;
  }

  watchTasks() {
    return this.taskChanges$.asObservable();
  }
}

export const drawingService = new AssemblyDrawingService();

