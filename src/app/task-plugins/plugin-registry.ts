import { Type } from '@angular/core';
import { BaseTaskPlugin } from './base-task.plugin';

export const PluginRegistry: Record<string, () => Promise<Type<BaseTaskPlugin>>> = {
  Welding : () => import('./assembly-tasks/assembly-task.plugin').then(m => m.AssemblyTaskPlugin),
  LoadingMaterial: () => import('./material-tasks/material-task.plugin').then(plugin => plugin.MaterialTaskPlugin)
};
