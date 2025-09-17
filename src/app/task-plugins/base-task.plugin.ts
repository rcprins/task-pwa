import { Type } from "@angular/core";
import { BaseTaskDetailsComponent } from "./base-task-details.component";
import { Task } from "../models/task.model";

export abstract class BaseTaskPlugin {
    abstract getTaskDetailsComponent(): Type<BaseTaskDetailsComponent>;
    abstract getTaskDetails(task: Task): void
}