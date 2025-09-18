import { Injectable } from '@angular/core';
import { Task, TaskState } from '../models/task.model';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { concatMap, firstValueFrom, from, map, mergeMap, toArray } from 'rxjs';
import { REMOTE_STORE_TASK } from '../local-database-definitions';
import { pluginLoader } from '../task-plugins/plugin-loader';

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
        console.log("Updating local entity with id:'" + task.id + "' updated in backend");
        this.taskChanges$.next();
      });
  }

  getTasks(): Observable<Task[]> {
    return this.dbService.getAll<Task>(REMOTE_STORE_TASK).pipe(
      mergeMap(tasks => from(tasks)),
      concatMap(task =>
        from(pluginLoader.loadPlugin(task.type)).pipe(
          map(plugin => {
            plugin.getTaskDetails(task);
            return task;
          })
        )
      ),
      toArray()
    );
  }

   getActiveTasks(): Observable<Task[]> {
    return this.dbService.getAll<Task>(REMOTE_STORE_TASK).pipe(
      map(tasks => tasks.filter(task => task.state != TaskState.Completed)),
      mergeMap(tasks => from(tasks)),
      concatMap(task =>
        from(pluginLoader.loadPlugin(task.type)).pipe(
          map(plugin => {
            plugin.getTaskDetails(task);
            return task;
          })
        )
      ),
      toArray()
    );
  }
  deleteTask(task: Task): void {
    alert("Task '" + task.id + "' will be deleted.");
    if (task.id) {
      this.dbService.delete<Task>(REMOTE_STORE_TASK, task.id).subscribe({
        next: () => alert("Task '" + task.id + "' is deleted."),
        error: () => alert("Task '" + task.id + "' is not deleted.")
      });
    }
  }

  deleteAllTasks() {
    this.dbService.clear(REMOTE_STORE_TASK).subscribe(() => {
      this.taskChanges$.next();
    })
  }

}
