export interface ICommandItem {
  name: string
  title: string
  subtitle: string
  description: string
  icon?: string
  code?: string
}

export interface IManifest {
  name: string
  id: string
  version: string
  description: string
  main: string
  code: string
  icon: string
  commands: ICommandItem[]
}

export class Manifest {
  raw: IManifest
  constructor(public _raw: string) {
    this.raw = JSON.parse(this._raw || '{}')
  }

  get id() {
    return this.raw.id
  }

  get name() {
    return this.raw.name
  }

  get description() {
    return this.raw.description
  }
}
