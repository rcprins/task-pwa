import { Component, HostListener, ViewChild } from '@angular/core';
import { TaskService } from './services/task.service';
import { Task } from './models/task.model';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { TaskComponent2 } from './tasks/task/task.component';
import { TaskListComponent } from './tasks/list/task-list.component';
import { AdhocTaskComponent } from './tasks/adhoc/adhoc-task/adhoc-task.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone:false
})
export class AppComponent {
  title = 'Mobile tracking app'; 
  isOnline: boolean = navigator.onLine;

  @ViewChild('tabGroup')
  tabGroup!: MatTabGroup;

  @ViewChild('taskList')
  taskList!: TaskListComponent;

  @ViewChild('taskComponent')
  taskComponent!: TaskComponent2;

  @ViewChild('adhocTaskComponent')
  adhocTaskComponent!:AdhocTaskComponent;

  constructor(private notesService: TaskService) {}

  @HostListener('window:online')
  @HostListener('window:offline')
  updateOnlineStatus() {
    this.isOnline = navigator.onLine;
  }

  handleTaskSelected(task: Task) {
    this.taskComponent.task = task;
    this.tabGroup.selectedIndex = 1;
  }

  handleTaskFinished(task:Task) {
    debugger;
    this.tabGroup.selectedIndex = 0;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.adhocTaskComponent.stopScanning()
    switch (event.index) {
      case 0:
        debugger;
        this.taskList.activate();
        break;
      case 2:
        this.adhocTaskComponent.startScanning()
        break
      default:
        break;
    }
  }
}