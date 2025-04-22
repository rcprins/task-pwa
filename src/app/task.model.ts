export enum TaskState {
  New = 'New',
  InProgress = 'In progres',
  Paused = 'Paused',
  Completed = 'Completed'
}

export interface Task {
    id?: number;
    title: string;
    content: string;
    timestamp: Date;
    synced?: boolean;
    state: TaskState;
  }  