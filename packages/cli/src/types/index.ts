export type CommandItem = {
  name: string
  title: string
  subtitle: string
  description: string
  icon?: string
  code?: string
}

export type Manifest = {
  name: string
  id: string
  version: string
  description: string
  main: string
  code: string
  icon: string
  commands: CommandItem[]
}
