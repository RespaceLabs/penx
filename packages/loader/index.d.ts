interface Window {
  __IS_DB_OPENED__: boolean
  penx: {
    pluginId?: string
    registerCommand(command: any): void
    registerComponent(type: string, component: any): void
    executeCommand(id: string): void
    createSettings(schema: any[]): void
    notify(message: string, options?: any): any
  }
}
