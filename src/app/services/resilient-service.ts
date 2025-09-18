import { defaultIfEmpty, from, Observable, of, switchMap, tap } from "rxjs";
import { LocalEntity } from "../models/local-entity";
import { ReadOnlyResilientService } from "./readonly-resilient-service";

export abstract class ResilientService<T extends LocalEntity> extends ReadOnlyResilientService<T> {

  protected override handleOnline(): void {
    super.handleOnline();
    this.syncAll();
  }

  override add(localEntity: T): Observable<T> {
    localEntity.synced = false;
    const observableTask = super.add(localEntity);
    this.sync(localEntity);
    return observableTask;
  }

  override update(localEntity: T): Observable<T> {
    var observableTask = super.update(localEntity);
    observableTask.subscribe((task) => {
      this.sync(task);
    })
    return observableTask;
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
            next: () => {
              console.log('Updated!')
              this.handleUpdatedEntity(localEntity);
            },
            error: (err) => console.error('Update error', err)
          })
      });                
    }
  }

  handleUpdatedEntity(localEntity: T) {
    //NOOP.
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