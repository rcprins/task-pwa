import { PluginRegistry } from "./plugin-registry";
import { BaseTaskPlugin } from "./base-task.plugin";

class PluginLoader {
    async loadPlugin(pluginType: string | undefined): Promise<BaseTaskPlugin> {
        if (pluginType == undefined) throw new Error("Task Type not defined.");
        let plugin = PluginRegistry[pluginType];
        if (plugin == undefined) {
            plugin = () => import('./default-task.plugin').then(plugin => plugin.DefaultTaskPlugin)
        };
        const PluginClass = await plugin();
        return new PluginClass();
    }
}

export const pluginLoader = new PluginLoader();