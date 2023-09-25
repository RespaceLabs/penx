declare interface PluginContext {
  pluginId?: string
  registerCommand(name: string, callback: () => void): void
  registerComponent(options: RegisterComponentOptions): void
  executeCommand(id: string): void
  createSettings(schema: any[]): void
  notify(message: string, options?: any): any
}

interface RegisterComponentOptions {
  at: 'status_bar' | 'activity_bar'
  component: any
}

export { PluginContext }
