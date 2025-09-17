import { Component } from '@angular/core';
import { Task, TaskState } from '../models/task.model';
import { WorkItem, MaterialWorkItem, AssemblyWorkItem } from '../models/work-item.model';
import { TaskExecutionService } from '../services/task-execution.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'task-execution',
  templateUrl: './task-execution.component.html',
  styleUrls: ['./task-execution.component.css'],
  standalone: false
})
export class TaskExecutionComponent {
  newTask = '';
  tasks: Task[] = [];


  constructor(private taskExecutionService: TaskExecutionService) {}
  
  ngOnInit(): void {
    console.log('TasksComponent initialized');
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
  }

  createTask(): void {
    const task: Task = {
      id: uuidv4(),
      title: "Task",
      type: this.newTask.trim(),
      timestamp: new Date(),
      state: TaskState.New,
      synced: false,
      workItems: []
    };

    switch (task.type) {
      case 'LoadingMaterial':
        const mat1 = {} as MaterialWorkItem;
        mat1.id = uuidv4();
        mat1.length = '12 m';
        mat1.profile =  'HEA140';
        mat1.location = 'Bay 01';
        task.workItems.push(mat1);
        const mat2 = {} as MaterialWorkItem;
        mat2.id = uuidv4();
        mat2.length = '12 m';
        mat2.profile =  'HEA140';
        mat2.location = 'Bay 01';
        task.workItems.push(mat2);
        const mat3 = {} as MaterialWorkItem;
        mat3.id = uuidv4();
        mat3.length = '8 m';
        mat3.profile =  'HEA140';
        mat3.location = 'Bay 02';
        task.workItems.push(mat3);
        break;
      case 'Welding':
        const wi = {} as AssemblyWorkItem;
        wi.id = uuidv4();
        wi.drawing = uuidv4();
        task.workItems.push(wi);
        break;
      default:
        break;
    }
  
    this.taskExecutionService.syncTask(task);
    this.newTask = '';
  }

  deleteTask(task: Task): void {
    this.taskExecutionService.deleteTask(task);
  }

}
