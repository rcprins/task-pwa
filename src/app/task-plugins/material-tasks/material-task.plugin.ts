import { Type } from "@angular/core";
import { Task } from "../../models/task.model";
import { BaseTaskDetailsComponent } from "../base-task-details.component";
import { BaseTaskPlugin } from "../base-task.plugin";
import { MaterialTaskDetailsComponent } from "./material-task-details.component";

export class MaterialTaskPlugin extends BaseTaskPlugin {
    override getTaskDetailsComponent(): Type<BaseTaskDetailsComponent> {
        return MaterialTaskDetailsComponent;
    }
    override getTaskDetails(task: Task): void {
        console.log('Loading the details for material task :' + task.id);
    }
}