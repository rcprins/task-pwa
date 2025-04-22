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


  constructor(private taskExecitionService: TaskExecutionService) {}
  
  ngOnInit(): void {
    console.log('TasksComponent initialized');
    this.taskExecitionService.getTasks().then((tasks) => {
      this.tasks = tasks;
    });
    this.taskExecitionService.watchTasks().subscribe(() => {
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.taskExecitionService.getTasks().then((tasks) => {
      this.tasks = tasks.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    });
  }

  createTask(): void {
    const task: Task = {
      title: "Task",
      content: this.newTask.trim(),
      timestamp: new Date(),
      state: TaskState.New,
      synced: false
    };
  
    this.taskExecitionService.syncTask(task);
    this.newTask = '';
  }

  deleteTask(task: Task): void {
    this.taskExecitionService.deleteTask(task);
  }

}
