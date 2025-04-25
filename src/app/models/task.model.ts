import { LocalEntity } from "./local-entity";

export enum TaskState {
  New = 'New',
  InProgress = 'In progres',
  Paused = 'Paused',
  Completed = 'Completed'
}

export interface Task extends LocalEntity {
    title: string;
    content: string;
    timestamp: Date;
    state: TaskState;
  }  