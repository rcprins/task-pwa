import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { BaseTaskDetailsComponent } from "./base-task-details.component";

@Component({
    selector: 'default-task',
    standalone: true,
    templateUrl: './default-task-details.component.html',
    imports: [MatCardModule] 
})
export class DefaultTaskDetailsComponent extends BaseTaskDetailsComponent {
}