import { Component } from "@angular/core";
import { BaseTaskDetailsComponent } from "../base-task-details.component";
import { MatCardModule } from "@angular/material/card";
import { MatCheckbox } from "@angular/material/checkbox";

@Component({
    selector: 'assembly-task',
    standalone: true,
    templateUrl: './assembly-task-details.component.html',
    imports: [MatCardModule, MatCheckbox]
})

export class AssemblyTaskDetailsComponent extends BaseTaskDetailsComponent {
}
