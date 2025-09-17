import { inject, Type } from "@angular/core";
import { BaseTaskPlugin } from "../base-task.plugin";
import { AssemblyTaskDetailsComponent } from "./assembly-task-details.component";
import { Task } from "../../models/task.model";
import { AssemblyDrawingService, drawingService } from "./assembly-drawing.service";
import { AssemblyWorkItem } from "../../models/work-item.model";

export class AssemblyTaskPlugin extends BaseTaskPlugin {
    override getTaskDetailsComponent(): Type<AssemblyTaskDetailsComponent> {
        return AssemblyTaskDetailsComponent;
    }
    override getTaskDetails(task: Task): void {

        task.workItems.forEach(workItem => {
            const assemblyWorkItem = workItem as AssemblyWorkItem;
            drawingService.getById(assemblyWorkItem.drawing);
        })
    }
}