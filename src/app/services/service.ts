import { NgxIndexedDBService } from "ngx-indexed-db";
import { Observable } from "rxjs";
import { LocalEntity } from "../models/local-entity";

export abstract class Service<T extends LocalEntity> {

    constructor(protected dbService: NgxIndexedDBService, private local_db_table_name: string) {
            
        window.addEventListener('online', () => {
            console.log("Syncing after getting online again '" + navigator.onLine + "'");
            this.syncAll()
        });
    }

    add(localEntity: T): Observable<T> {
        localEntity.synced = false;
        const observableNote = this.dbService.add<T>(this.local_db_table_name, localEntity);
        this.sync(localEntity);
        return observableNote;
    }

    update(localEntity: T): Observable<T> {
        console.log("Updating local entity with id:'" + localEntity.id + "' in local store")
        localEntity.synced = false;
        const observableTask = this.dbService.update<T>(this.local_db_table_name, localEntity);
        observableTask.subscribe((task) => {
          this.sync(task);
        })
        return observableTask;
    }

    deleteTask(task: T): Observable<unknown> {
    if (!task.id) throw Error("Cannot delete task as it has has no id");
    return this.dbService.delete<T>(this.local_db_table_name, task.id);
    }

    abstract getAllRemote(): Observable<T[]>;

    getAllLocal(): Observable<T[]> {
        return this.dbService.getAll<T>(this.local_db_table_name);
    }

    getAll(): Observable<T[]> {
        if (navigator.onLine) {
            return this.getAllRemote();
        } else {    
            return this.getAllLocal();
        }
    }

    syncAll() {
        if (navigator.onLine) {
            this.getAllLocal().subscribe((localEntities: T[]) => {
                const unsyncedLocalEntities = localEntities.filter(localEntity => !localEntity.synced);
                for (const localEntity of unsyncedLocalEntities) {
                  this.sync(localEntity);
                }
              });      
        }
    }

    sync(localEntity: T) {
        if (navigator.onLine) {
            console.log("Local entity synced: '" + localEntity.id + "'");
            if (localEntity.synced) return;
                this.backendSync(localEntity).then(() => {
                console.log("Updating sync status of local entity: '" + localEntity.id + "'");
                localEntity.synced = true;
                console.log("Updating sync status of local entity: '" + localEntity.id + "' '" + localEntity.synced + "'");
                this.dbService.update(this.local_db_table_name, localEntity).subscribe({
                    next: () => console.log('Updated!'),
                    error: (err) => console.error('Update error', err)
                  })
            });                
        }
    }

    abstract updateInBackend(localEntity:T):void;
    
    backendSync(localEntity: T): Promise<void> {
        return new Promise(resolve => {
          setTimeout(() => {
            console.log("Syncing local entity with id:'" + localEntity.id + "' to backend" + localEntity);
            this.updateInBackend(localEntity);
            resolve();
          }, 1000); 
        });
      }
    

}