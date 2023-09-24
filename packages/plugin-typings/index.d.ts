declare interface PluginContext {
  registerCommand(name: string, callback: () => void): void
  registerComponent(type: string, component: any): void
  executeCommand(id: string): void
  createSettings(schema: any[]): void
  notify(message: string, options?: any): any
}

export { PluginContext }
