import { Component } from '@angular/core';
import { Task, TaskState } from '../task.model';
import { TaskExecutionService } from '../task-execution.service';

@Component({
  selector: 'task-execution',
  templateUrl: './task-execution.component.html',
  styleUrl: './task-execution.component.css',
  standalone: false
})
export class TaskExecutionComponent {
  newTask = '';
  tasks: Task[] = [];


  constructor(private taskExecutionService: TaskExecutionService) {}
  
  ngOnInit(): void {
    console.log('TasksComponent initialized');
//    this.taskExecutionService.getTasks().then((tasks) => {
    this.taskExecutionService.getTasks().subscribe((tasks) => {
        this.tasks = tasks;
    });
    this.taskExecutionService.watchTasks().subscribe(() => {
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.taskExecutionService.getTasks().subscribe((tasks) => {
        this.tasks = tasks.sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
      }
    )
    // this.taskExecutionService.getTasks().then((tasks) => {
    //   this.tasks = tasks.sort((a, b) => {
    //     return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    //   });
    // });
  }

  createTask(): void {
    const task: Task = {
      title: "Task",
      content: this.newTask.trim(),
      timestamp: new Date(),
      state: TaskState.New,
      synced: false
    };
  
    this.taskExecutionService.syncTask(task);
    this.newTask = '';
  }

  deleteTask(task: Task): void {
    this.taskExecutionService.deleteTask(task);
  }

}
