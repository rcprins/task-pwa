import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../task.service';
import { Task, TaskState } from '../task.model';
import { TaskExecutionService } from '../task-execution.service';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  standalone:false
})
export class TaskComponent implements OnInit {
  @ViewChild('tabGroup')
  tabGroup!: MatTabGroup;

  
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
     this.loadLocalTasks();
    })
  }

  ngOnInit(): void {
    console.log('TasksComponent initialized');
    this.loadRemoteTasks();
    // this.activeTask = this.tasks[0];
  }

  ngAfterViewInit() {
    // Now it's safe to use tabGroup
    console.log('Tab group ready:', this.tabGroup);
    // Example: start on the second tab
    this.tabGroup.selectedIndex = 1;
  }

  reloadTasks(event: MatTabChangeEvent) {
    debugger;
    if (event.index == 0 ) this.loadRemoteTasks();
  }
    

  highlight(id: number) {
    this.selectedRowIndex = id
    debugger;
//    this.tabGroup.selectedIndex = 1;
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
    this.tabGroup.selectedIndex = 0;
    this.loadRemoteTasks();
  }

  loadLocalTasks(): void {
    this.taskService.getAllLocal().subscribe((tasks) => {
       this.applyToUI(tasks);
    });
  }

  loadRemoteTasks(): void {
    this.taskService.getAll().subscribe((tasks) => {
       this.applyToUI(tasks);
    });
  }

  private applyToUI(tasks: Task[]) {
    this.tasks = tasks.filter((task) => task.state != TaskState.Completed);
    debugger;
    this.taskDatasource = new MatTableDataSource<Task>(this.tasks);
    if (this.tasks.length > 0) {
      this.activeTask = this.tasks[0];
      this.selectedRowIndex = 1;
    } else {
      this.activeTask = undefined;
      this.selectedRowIndex = -1;
    }
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task).subscribe(() => {
      this.loadLocalTasks();
    });
  }

  private update(task: Task): void {
    this.activeTask = task.state == TaskState.Completed ? undefined : task;
    task.timestamp = new Date();
    this.taskService.update(task).subscribe(() => {
      this.loadLocalTasks();
    });
  }


}
