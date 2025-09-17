import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { BaseTaskDetailsComponent } from "../base-task-details.component";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'material-task',
    standalone: true,
    templateUrl: './material-task-details.component.html',
    imports: [MatCardModule, CommonModule, MatTableModule, MatCheckboxModule] 
})
export class MaterialTaskDetailsComponent extends BaseTaskDetailsComponent {
    displayedColumns: string[] = ['profile', 'length', 'location'];
}