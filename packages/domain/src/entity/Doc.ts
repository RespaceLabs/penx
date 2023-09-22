import { IDoc } from '@penx/local-db'

export class Doc {
  constructor(private raw: IDoc) {}

  get id(): string {
    return this.raw.id
  }

  getFullPath(baseDir = 'docs'): string {
    return `${baseDir}/${this.id}.json`
  }

  get filename() {
    return `${this.id}.json`
  }

  get content() {
    return JSON.parse(this.raw.content)
  }

  toJSON() {
    return {
      ...this.raw,
      content: this.content,
    }
  }

  stringify(): string {
    return JSON.stringify(this.toJSON(), null, 2)
  }
}
