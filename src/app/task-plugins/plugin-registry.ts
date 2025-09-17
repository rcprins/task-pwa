import { Type } from '@angular/core';
import { BaseTaskDetailsComponent } from './base-task-details.component';
import { BaseTaskPlugin } from './base-task.plugin';

// export const PluginRegistry: Record<string, () => Promise<Type<BaseTaskDetailsComponent>>> = {
//   Welding : () => import('./assembly-tasks/assembly-task-details.component').then(m => m.AssemblyTaskDetailsComponent),
//   LoadingMaterial:  () => import('./material-tasks/material-task-details.component').then(m => m.MaterialTaskDetailsComponent)
// };

export const PluginRegistry: Record<string, () => Promise<Type<BaseTaskPlugin>>> = {
  Welding : () => import('./assembly-tasks/assembly-task.plugin').then(m => m.AssemblyTaskPlugin),
  LoadingMaterial: () => import('./material-tasks/material-task.plugin').then(plugin => plugin.MaterialTaskPlugin)
};