import { NgxIndexedDBService } from "ngx-indexed-db";
import { BehaviorSubject, defaultIfEmpty, forkJoin, from, Observable, of, switchMap, tap } from "rxjs";
import { LocalEntity } from "../models/local-entity";

export abstract class ReadOnlyResilientService<T extends LocalEntity> {

  private entityChanges$ = new BehaviorSubject<T[] | undefined>(undefined);

  constructor(protected dbService: NgxIndexedDBService, protected local_db_table_name: string) {
          
      window.addEventListener('online', () => {
        this.handleOnline();
      });
  }


  protected handleOnline() {
    console.log("Syncing after getting online again '" + navigator.onLine + "'");
    // this.getAllRemote();
    this.updateLocalDB();
  }

  watchEntities() {
    return this.entityChanges$.asObservable();
  }

  updateLocalDB(): void {
  forkJoin({
    remoteEntities: this.getAllRemoteInternal(),
    localEntities: this.dbService.getAll<T>(this.local_db_table_name)
  }).subscribe(({ remoteEntities, localEntities }) => {
    const newEntities = remoteEntities.filter(
      remote => remote.id && !localEntities.some(local => local.id === remote.id)
    );

    const deletedEntities = localEntities
      .filter(local => local.id && !remoteEntities.some(remote => remote.id === local.id))
      .map(entity => entity.id!);

    const add$ = newEntities.length
      ? this.dbService.bulkAdd(this.local_db_table_name, newEntities)
      : of(null);

    const delete$ = deletedEntities.length
      ? this.dbService.bulkDelete(this.local_db_table_name, deletedEntities)
      : of(null);

    forkJoin([add$, delete$]).subscribe(() => {
      console.log('Local tasks synced with remote.');
      if (newEntities.length || deletedEntities.length) {
        this.entityChanges$.next(newEntities);
      }
    });
  });
}

  // updateLocalDB():void {
  //   let newEntities: T[] = [];
  //   let deletedEntities: string[] = [];
  //   this.getAllRemoteInternal().subscribe((remoteEntities) => {
  //     this.dbService.getAll<T>(this.local_db_table_name).subscribe((localEntities) => {
  //       remoteEntities.forEach((remoteEntity) => {
  //         if (remoteEntity.id) {
  //           if (!localEntities.find(localEntity => localEntity.id == remoteEntity.id)) {
  //             console.log("pushing entity: " + remoteEntity.id);
  //             newEntities.push(remoteEntity);
  //           }
  //         }
  //       });
  //       localEntities.forEach((localEntity) => {
  //         if (localEntity.id) {
  //           if (!remoteEntities.find((remoteEntity) => remoteEntity.id == localEntity.id)) {
  //             deletedEntities.push(localEntity.id);
  //           } 
  //         }
  //       });
  //       this.dbService.bulkAdd(this.local_db_table_name, newEntities).subscribe(() => {
  //         console.log("Local tasks updated with the result of the remote tasks update.");
  //         this.entityChanges$.next(newEntities);
  //       })
  //       this.dbService.bulkDelete(this.local_db_table_name, deletedEntities).subscribe(() => {
  //         this.entityChanges$.next(newEntities);
  //       })
  //     })
  //   })
  // }

  private getByIdLocal(id: string): Observable<T | undefined> {
      
      return from(this.dbService.getByID<T>(this.local_db_table_name, id));
  }

  getById(id: string): Observable<T> {

    return this.getByIdLocal(id).pipe(

      defaultIfEmpty(undefined),
      switchMap(localEntity => {
        if (localEntity !== undefined) {
          return of(localEntity);
        } else {
          debugger;
          return this.getByIdRemote(id).pipe(
            tap(remoteEntity => this.add(remoteEntity))
          );
        }
      })
    );
  }

  abstract getByIdRemote(id:string):Observable<T>;

  add(localEntity: T): Observable<T> {
      localEntity.synced = false;
      const observableTask = this.dbService.add<T>(this.local_db_table_name, localEntity);
      return observableTask;
  }

  update(localEntity: T): Observable<T> {
      console.log("Updating local entity with id:'" + localEntity.id + "' in local store")
      localEntity.synced = false;
      const observableTask = this.dbService.update<T>(this.local_db_table_name, localEntity);
      return observableTask;
  }

  deleteEntity(entity: T): Observable<T[]> {
    if (!entity.id) throw Error("Cannot delete enyity as it has has no id");
    const observable =  this.dbService.delete<T>(this.local_db_table_name, entity.id);
    observable.subscribe({
      next: () => console.log("Delete success"),
      error: err => console.error("Delete error", err)
    })
    return observable;
  }

  getAllRemote(): Observable<T[]> {
    this.updateLocalDB();
    return this.getAllLocal();
  }

  abstract getAllRemoteInternal(): Observable<T[]>;

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
}