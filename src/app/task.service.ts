import { Injectable, HostListener } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Task } from './task.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { TaskExecutionService } from './task-execution.service';
import { LOCAL_STORE_TASK } from './local-database-definitions';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskChanges$ = new BehaviorSubject<void>(undefined);

 
  constructor(private dbService: NgxIndexedDBService, private taskExecutionService: TaskExecutionService) {
    window.addEventListener('online', () => {
        console.log('Syncing after getting online again')
        this.syncTasks()
      });

    taskExecutionService.watchTasks().subscribe(() => {
      console.log("Updating local database with changes from remote.")
      this.updateLocalDB();
    }); 
  }

  watchTasks() {
    return this.taskChanges$.asObservable();
  }

  syncTasks() {
    if (!navigator.onLine) return;
    this.dbService.getAll<Task>(LOCAL_STORE_TASK).subscribe(localTasks => {
      const unsyncedNotes = localTasks.filter(task => !task.synced);
      
      // Simulate sync to server
      for (const localTask of localTasks) {
        this.fakeServerSync(localTask).then(() => {
          localTask.synced = true;
          this.dbService.update(LOCAL_STORE_TASK, localTask);
        });
      }
    });
  }

  updateLocalDB() {
    let newTasks: Task[] = [];
    this.taskExecutionService.getTasks().then((remoteTasks) => {
      this.dbService.getAll<Task>(LOCAL_STORE_TASK).subscribe((tasks) => {
        remoteTasks.forEach((remoteTask) => {
          if (remoteTask.id) {
            console.log("pushing task");
            newTasks.push(remoteTask);
          }
        })
        this.dbService.bulkAdd(LOCAL_STORE_TASK, newTasks).subscribe(() => {
          console.log("Remote tasks added with bulk api");
          this.taskChanges$.next();          
        })
      })
    })
  }
  // this.dbService.getByID<Task>(LOCAL_STORE_TASK, remoteTask.id).subscribe((localTask) => {
  //   if (!localTask) {
  //     this.dbService.add<Task>(LOCAL_STORE_TASK, remoteTask).subscribe({
  //       next: (key) => {
  //         console.log('Added with key:', key);
  //       },
  //       error: (err) => {
  //         console.error('Add failed:', err);
  //       }
  //     });
  //   }
  // })


  addTask(note: Task): Observable<Task> {
    const observableNote = this.dbService.add<Task>(LOCAL_STORE_TASK, note);
    this.syncTasks();
    return observableNote;
  }

  updateTask(task: Task): Observable<Task> {
    const observableTask = this.dbService.update<Task>(LOCAL_STORE_TASK, task);
    observableTask.subscribe((tasks) => {
      this.syncTasks();
    })
    return observableTask;
  }

  getTasks(): Observable<Task[]> {
    return this.dbService.getAll<Task>(LOCAL_STORE_TASK);
  }

  deleteTask(task: Task): Observable<unknown> {
    if (!task.id) throw Error("Cannot delete task as it has has no id");
    return this.dbService.delete<Task>(LOCAL_STORE_TASK, task.id);
  }

  fakeServerSync(task: Task): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.taskExecutionService.syncTask(task);
        resolve();
      }, 1000); 
    });
  }




}
