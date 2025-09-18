import { Component, ViewChild } from '@angular/core';
import { Task, TaskState } from '../../../models/task.model';
import { BarcodeScannerComponent } from '../../../barcode-scanner/barcode-scanner.component';
import { TaskService } from '../../../services/task.service';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { TabComponent } from '../../../interfaces/tab-component.inferface';

@Component({
  selector: 'adhoc-task',
  standalone: true,
  imports: [
    MatCardModule,
    BarcodeScannerComponent,
    MatToolbar,
    MatCardActions,
    MatButton
  ],
  templateUrl: './adhoc-task.component.html',
  styleUrl: './adhoc-task.component.css'
})
export class AdhocTaskComponent implements TabComponent{

  @ViewChild('barcodeScanner')
  private barcodeScanner!: BarcodeScannerComponent;

  constructor(private taskService: TaskService) {
  }

  selected(): void {
    this.barcodeScanner.startScanning();
  }

  deselected(): void {
    this.barcodeScanner.stopScanning();
  }

  join() {
    var task: Task = JSON.parse(this.barcodeScanner.scannedResult);
    task.state = TaskState.New;
    this.taskService.add(task);
    alert("Task has been added to your list.");
    this.barcodeScanner.scannedResult = '';
  }
}
