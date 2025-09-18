import { Component, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Task, TaskState } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TabComponent } from '../../interfaces/tab-component.inferface';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'task-list',
  standalone: true,
 imports: [CommonModule, MatTableModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements TabComponent{

  @Output() 
   taskSelected = new EventEmitter<Task>();

  taskDatasource = new MatTableDataSource<Task>();
  displayedColumns = ["id", 'type', 'state', 'timestamp'];
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {
    taskService.watchTasks().subscribe(() => {
      console.log("local DB updated. Loading tasks..");
      this.loadLocalTasks();
    })
  }

  selected(): void {
    this.loadRemoteTasks();
  }

  deselected(): void {
    //NOOP
  }

  getFirstTask(): Observable<Task> {
    return this.taskService.getAll().pipe(
      map(tasks => tasks.filter(task => task.state != TaskState.Completed )),
      map(tasks => tasks[0])
    );
  }

  async hasTasks(): Promise<boolean> {
    return await this.taskService.hasTasks();
  }


  loadRemoteTasks(): void {
    this.taskService.getAll().subscribe((tasks) => {
       this.applyToUI(tasks);
    });
  }
    
  loadLocalTasks(): void {
    this.taskService.getAllLocal().subscribe((tasks) => {
       this.applyToUI(tasks);
    });
  }

  private applyToUI(tasks: Task[]) {
    this.tasks = tasks.filter((task) => task.state != TaskState.Completed);
    this.taskDatasource = new MatTableDataSource<Task>(this.tasks);
  }

  selectTask(task: Task) {
    this.taskSelected.emit(task);
  }
}
