import { Component, HostListener, ViewChild } from '@angular/core';
import { Task } from './models/task.model';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { TaskComponent } from './tasks/task/task.component';
import { TaskListComponent } from './tasks/list/task-list.component';
import { AdhocTaskComponent } from './tasks/adhoc/adhoc-task/adhoc-task.component';
import { TabComponent } from './interfaces/tab-component.inferface';
import { TaskExecutionComponent } from './task-execution/task-execution.component';
import { AuthService } from './auth/authentication-service';
import { ApiService } from '../api.service';

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

  @ViewChild('taskListTabComponent')
  taskListTabComponent!: TaskListComponent;

  @ViewChild('taskTabComponent')
  taskTabComponent!: TaskComponent;

  @ViewChild('adhocTaskTabComponent')
  adhocTaskTabComponent!:AdhocTaskComponent;

   @ViewChild('backendTabComponent')
  backendTabComponent!:TaskExecutionComponent;

  private _activeTabComponent?: TabComponent;

  apiData: any;

  constructor(public auth: AuthService, private api: ApiService) {
  }

  async getUsers() {
    this.apiData = await this.api.getUsers();
  }

  @HostListener('window:online')
  @HostListener('window:offline')
  updateOnlineStatus() {
    this.isOnline = navigator.onLine;
  }

  handleTaskSelected(task: Task) {
    this.taskTabComponent.task = task;
    this.tabGroup.selectedIndex = 1;
  }

  async handleTaskFinished(task:Task) {
    if (this.tabGroup.selectedIndex = 1) {
      if (await this.taskListTabComponent.hasTasks()) {
        if (confirm("Would you like to proceed with the next task?")) {
          this.setNextTaskComponentInput();
        }
      } else {
          alert("All done for today! Wishing you a relaxing evening.")
          this.tabGroup.selectedIndex = 0;
      }
    }
  }

  setNextTaskComponentInput() {
    this.taskListTabComponent.getFirstTask().subscribe(task => {
      this.taskTabComponent.task = task;
    });
   }

  onTabChange(event: MatTabChangeEvent) {
    if (this._activeTabComponent != undefined) this._activeTabComponent.deselected();
    switch (event.index) {
      case 0:
        this.taskListTabComponent.selected();
        this._activeTabComponent = this.taskListTabComponent;
        break;
      case 1:
        this._activeTabComponent = this.taskTabComponent;
        this.setTaskComponentInput();
        this.taskTabComponent.selected();
        break;
      case 2:
        this._activeTabComponent = this.adhocTaskTabComponent;
        this.adhocTaskTabComponent.selected()
        break
      case 3:
        this._activeTabComponent = this.backendTabComponent;
        this.backendTabComponent.selected();
        break;
    }
  }
  setTaskComponentInput() {
    if (this.taskTabComponent.task.id == undefined) {
      this.taskListTabComponent.getFirstTask().subscribe(task => {
        this.taskTabComponent.task = task;
      })

    }
  }
  alertIDToken() {
    alert("ID token: " + this.auth.getIdToken());
  }
  alertAccessToken() {
    alert("Access token: " + this.auth.getAccessToken());
  }
  alertRefreshToken() {
    alert("Refresh token: " + this.auth.getRefreshToken());
  }
}
