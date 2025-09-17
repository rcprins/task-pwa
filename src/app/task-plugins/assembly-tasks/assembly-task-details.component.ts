import { Component } from "@angular/core";
import { BaseTaskDetailsComponent } from "../base-task-details.component";
import { AssemblyDrawingService } from "./assembly-drawing.service";
import { MatCardModule } from "@angular/material/card";

@Component({
    selector: 'assembly-task',
    standalone: true,
    templateUrl: './assembly-task-details.component.html',
    imports: [MatCardModule] 
})

export class AssemblyTaskDetailsComponent extends BaseTaskDetailsComponent {
}