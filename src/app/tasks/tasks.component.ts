import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task, TaskState } from '../models/task.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { BarcodeScannerComponent } from '../barcode-scanner/barcode-scanner.component';
import { pluginLoader } from '../task-plugins/plugin-loader';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  standalone:false
})
export class TaskComponentOld implements OnInit {

   @ViewChild('taskDetails', { read: ViewContainerRef, static: false })
  taskDetailsContainer!: ViewContainerRef;

  @ViewChild('tabGroup')
  tabGroup!: MatTabGroup;

  @ViewChild('barcodeScanner')
  private barcodeScanner!: BarcodeScannerComponent;
  
  TaskState = TaskState;
  newTask = '';
  activeTask?: Task;
  tasks: Task[] = [];
  selectedRowIndex = -1;
  taskDatasource = new MatTableDataSource<Task>();

  public displayedColumns = ["id", 'type', 'state', 'timestamp'];

  constructor(private taskService: TaskService) {
    taskService.watchTasks().subscribe(() => {
      console.log("local DB updated. Loading tasks..");
     this.loadLocalTasks();
    })
  }

  ngOnInit(): void {
    console.log('TasksComponent initialized');
    this.loadRemoteTasks();
  }

  ngAfterViewInit() {
    // Now it's safe to use tabGroup
    console.log('Tab group ready:', this.tabGroup);
    // Example: start on the second tab
    this.tabGroup.selectedIndex = 1;
    console.log("Scanner is initalized ", this.barcodeScanner);
  }

  onTabChange(event: MatTabChangeEvent) {
    this.barcodeScanner.stopScanning()
    switch (event.index) {
      case 0:
        this.loadRemoteTasks();
        break;
      case 1:
        debugger;
        this.loadTaskDetails();
        break;
      case 2:
        this.barcodeScanner.startScanning()
        break
      default:
        break;
    }
  }

  highlight(id: number) {
    this.selectedRowIndex = id
    this.tabGroup.selectedIndex = 1;
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

  getQRCodeValue(): string {
    if (this.activeTask)
      return JSON.stringify(this.activeTask);
    return '';
  }

  join() {
    var task: Task = JSON.parse(this.barcodeScanner.scannedResult);
    task.state = TaskState.New;
    this.taskService.add(task);
    alert("Task has been added to your list.");
    this.barcodeScanner.scannedResult = '';
  }

  private async loadTaskDetails() {
    if (this.activeTask == undefined) return;
    const plugin = await pluginLoader.loadPlugin(this.activeTask?.type);
    const componentType = plugin.getTaskDetailsComponent();
    this.taskDetailsContainer.clear();
    const component = this.taskDetailsContainer.createComponent(componentType);
    component.setInput('task', this.activeTask)
  }
}
