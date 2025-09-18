import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Task, TaskState } from '../models/task.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { TaskExecutionService } from './task-execution.service';
import { LOCAL_STORE_TASK } from '../local-database-definitions';
import { ResilientService } from './resilient-service';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends ResilientService<Task> {

  start(task: Task): void {
    task.state = TaskState.InProgress;
    this.update(task);
  }
  
  pause(task: Task): void {
    task.state = TaskState.Paused;
    this.update(task);
  }

  finish(task: Task): Observable<Task>  {
    task.state = TaskState.Completed;
    return this.update(task);
  }

  override update(task: Task): Observable<Task> {
    task.timestamp = new Date();
    return super.update(task);
  }
  
  override getByIdRemote<T>(id: string): Observable<T> {
    throw new Error('Method not implemented.');
  }

  constructor(override dbService: NgxIndexedDBService, private taskExecutionService: TaskExecutionService) {
    super(dbService, LOCAL_STORE_TASK);
  }

  override getAllRemoteInternal(): Observable<Task[]> {
    return this.taskExecutionService.getActiveTasks();
  }

  override updateInBackend(localTask: Task): void {
    this.taskExecutionService.syncTask(localTask);
  }

  override handleUpdatedEntity(task: Task): void {
    if (task.state == TaskState.Completed) this.deleteEntity(task);
  }

  watchTasks() {
    return this.watchEntities();
  }

}
