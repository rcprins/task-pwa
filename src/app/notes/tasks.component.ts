import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../task.service';
import { Task, TaskState } from '../task.model';
import { TaskExecutionService } from '../task-execution.service';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  standalone:false
})
export class TaskComponent implements OnInit {
  @ViewChild('renderButton') 
  renderButton = {} as MatButton;

  
  TaskState = TaskState;
  newTask = '';
  activeTask?: Task;
  tasks: Task[] = [];
  selectedRowIndex = -1;
  taskDatasource = new MatTableDataSource<Task>();

  public displayedColumns = ["id", 'content', 'state', 'timestamp'];

  constructor(private taskService: TaskService) {
    taskService.watchTasks().subscribe(() => {
      console.log("local DB updated. Loading tasks..");
     this.loadTasks();
    })
  }

  ngOnInit(): void {
    console.log('TasksComponent initialized');
    this.loadTasks();
    // this.activeTask = this.tasks[0];
  }



  highlight(id: number) {
    this.selectedRowIndex = id
  }

  start(task: Task): void {
    task.state = TaskState.InProgress;
    this.update(task);
  }

  pause(task: Task): void {
    task.state = TaskState.Paused;
    this.update(task);
  }

  resume(task: Task): void {
    this.start(task);
  }

  finish(task: Task): void {
    task.state = TaskState.Completed;
    this.update(task);
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
       this.tasks = tasks.filter((task) => task.state != TaskState.Completed); 
       this.taskDatasource = new MatTableDataSource<Task>(this.tasks);
       if (this.tasks.length > 0) {
        this.activeTask = this.tasks[0];
        this.selectedRowIndex = 1;         
       } else {
        this.activeTask = undefined;
        this.selectedRowIndex = -1;         
       }
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task).subscribe(() => {
      this.loadTasks();
    });
  }

  private update(task: Task): void {
    this.activeTask = task.state == TaskState.Completed ? undefined : task;
    task.timestamp = new Date();
    this.taskService.updateTask(task).subscribe(() => {
      this.loadTasks();
    });
  }

  async readNfcTag(task: Task) {
    if ('NDEFReader' in window) {
      const ndef: any = new (window as any).NDEFReader();
      try {
        await ndef.scan();
        console.log("Scan started successfully.");
        ndef.onreading = (event: { message: any; }) => {
          const message = event.message;
          for (const record of message.records) {
            console.log("Record type:", record.recordType);
            console.log("Data:", new TextDecoder().decode(record.data));
          }
        };
      } catch (error) {
        console.error("Error reading NFC tag:", error);
      }
    } else {
      console.warn("Web NFC is not supported on this device/browser.");
    }
  }
}
