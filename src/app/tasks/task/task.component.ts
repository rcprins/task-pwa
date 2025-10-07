import { Component, OnInit, ViewChild, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, TaskState } from '../../models/task.model';
import { pluginLoader } from '../../task-plugins/plugin-loader';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { QrGeneratorComponent } from '../../qr-generator-component/qr-generator-component.component';
import { MatButtonModule } from '@angular/material/button';
import { TabComponent } from '../../interfaces/tab-component.inferface';


@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  standalone:true,
  imports: [
    MatCardModule,
    CommonModule,
    MatToolbar,
    QrGeneratorComponent,
    MatButtonModule
  ]
})
export class TaskComponent implements OnInit, TabComponent {

  _task = {} as Task;

  @ViewChild('taskDetails', { read: ViewContainerRef, static: false })
  private taskDetailsContainer!: ViewContainerRef;

  @Output()
  taskFinished = new EventEmitter<Task>();

  @Input()
  set task(value:Task) {
    this._task = value;
    this.loadTaskDetails();
  }

  get task(): Task {
    return this._task;
  }

  TaskState = TaskState;

  constructor(private taskService: TaskService) {}

  selected(): void {
    //NOOP
  }

  deselected(): void {
    //NOOP
  }

  ngOnInit(): void {
    console.log('TasksComponent initialized');
  }

  start(): void {
    this.taskService.start(this.task);
  }

  pause(): void {
    this.taskService.pause(this.task);
  }

  resume(): void {
    this.start();
  }

  finish(): void {
    this.taskService.finish(this.task).subscribe(() => {
      this.taskFinished.emit(this.task);
    });
  }

  deleteTask(): void {
    this.taskService.deleteEntity(this.task);
  }

  getQRCodeValue(): string {
    if (this.task)
      return JSON.stringify(this.task);
    return '';
  }

  private async loadTaskDetails() {
    const plugin = await pluginLoader.loadPlugin(this.task.type);
    const componentType = plugin.getTaskDetailsComponent();
    this.taskDetailsContainer.clear();
    const component = this.taskDetailsContainer.createComponent(componentType);
    component.setInput('task', this.task)
  }
}
