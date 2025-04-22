import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { firstValueFrom } from 'rxjs';
import { REMOTE_STORE_TASK } from './local-database-definitions';



@Injectable({
  providedIn: 'root'
})
export class TaskExecutionService {
  private taskChanges$ = new BehaviorSubject<void>(undefined);

  constructor(private dbService: NgxIndexedDBService) {}

  watchTasks() {
    return this.taskChanges$.asObservable();
  }

  syncTask(task: Task): void {
      firstValueFrom(this.dbService.update<Task>(REMOTE_STORE_TASK, task)).then(() => {
        this.taskChanges$.next();
      });
  }

  getTasks(): Promise<Task[]> {
    return firstValueFrom(this.dbService.getAll<Task>(REMOTE_STORE_TASK));
  }

  deleteTask(task: Task): void {
    if (task.id) this.dbService.delete<Task>(REMOTE_STORE_TASK, task.id);
  }

}
