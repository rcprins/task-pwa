import { Component, HostListener } from '@angular/core';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone:false
})
export class AppComponent {

  title = 'Mobile tracking app'; 
  isOnline: boolean = navigator.onLine;
  
  constructor(private notesService: TaskService) {}


  @HostListener('window:online')
  @HostListener('window:offline')
  updateOnlineStatus() {
    this.isOnline = navigator.onLine;
  }
}