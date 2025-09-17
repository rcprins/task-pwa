import { Directive, Input } from '@angular/core';
import { Task } from '../models/task.model';

@Directive()
export abstract class BaseTaskDetailsComponent {
    @Input() task!: Task;
}