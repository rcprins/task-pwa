import { Type } from "@angular/core";
import { Task } from "../models/task.model";
import { BaseTaskDetailsComponent } from "./base-task-details.component";
import { BaseTaskPlugin } from "./base-task.plugin";
import { DefaultTaskDetailsComponent } from "./default-task-details.component";

export class DefaultTaskPlugin extends BaseTaskPlugin {
    override getTaskDetailsComponent(): Type<BaseTaskDetailsComponent> {
        return DefaultTaskDetailsComponent;
    }
    override getTaskDetails(task: Task): void {
        console.log('Loading the NO details for task :' + task.id);
    }
}