import { LocalEntity } from "./local-entity";
import { WorkItem } from "./work-item.model";

export enum TaskState {
  New = 'New',
  InProgress = 'In progress',
  Paused = 'Paused',
  Completed = 'Completed'
}

export interface Task extends LocalEntity {
    title: string;
    type: string;
    timestamp: Date;
    state: TaskState;
    workItems: WorkItem[];
  }  