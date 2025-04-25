import { Injectable, HostListener } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { TaskExecutionService } from './task-execution.service';
import { LOCAL_STORE_TASK } from '../local-database-definitions';
import { Service } from './service';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends Service<Task> {
  private taskChanges$ = new BehaviorSubject<Task[] | undefined>(undefined);
 
  constructor(override dbService: NgxIndexedDBService, private taskExecutionService: TaskExecutionService) {
    super(dbService, LOCAL_STORE_TASK);

    taskExecutionService.watchTasks().subscribe(() => {
      console.log("Updating local database with changes from remote.")
      this.updateLocalDB();
    }); 
  }

  override getAllRemote(): Observable<Task[]> {
    return this.taskExecutionService.getTasks();
  }

  override updateInBackend(localEntity: Task): void {
    this.taskExecutionService.syncTask(localEntity);
  }

  watchTasks() {
    return this.taskChanges$.asObservable();
  }

  updateLocalDB() {
    let newTasks: Task[] = [];
    this.taskExecutionService.getTasks().subscribe((remoteTasks) => {
      this.dbService.getAll<Task>(LOCAL_STORE_TASK).subscribe((localTasks) => {
        remoteTasks.forEach((remoteTask) => {
          if (remoteTask.id) {
            if (!localTasks.find(localTask => localTask.id == remoteTask.id)) {
              console.log("pushing task: " + remoteTask.id);
              newTasks.push(remoteTask);
            }
          }
        });
        this.dbService.bulkAdd(LOCAL_STORE_TASK, newTasks).subscribe(() => {
          console.log("Local tasks updated with the result of the remote tasks update.");
          this.taskChanges$.next(newTasks);          
        })
      })
    })
  }
}
