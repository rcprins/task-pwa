
export const LOCAL_STORE_TASK = 'local-task';
export const LOCAL_STORE_TASK_CHANGES = 'local-task-changes';
export const REMOTE_STORE_TASK = 'remote-task';
export const REMOTE_STORE_TASK_CHANGES = 'remote-task-changes';

export const taskSchema = [
    { name: 'version', keypath: 'version', options: { unique: false } },
    { name: 'content', keypath: 'content', options: { unique: false } },
    { name: 'timestamp', keypath: 'timestamp', options: { unique: false } },
    { name: 'state', keypath: 'state', options: { unique: false } }
  ]
  
export const taskChangesSchema = [
    { name: 'taskId', keypath: 'taskId', options: { unique: false } },
    taskSchema
  ]
  