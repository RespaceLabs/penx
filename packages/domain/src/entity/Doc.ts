import { format } from 'date-fns'
import { IDoc } from '@penx/local-db'

export class Doc {
  constructor(private raw: IDoc) {}

  get id(): string {
    return this.raw.id
  }

  get title(): string {
    return this.raw.title
  }

  getFullPath(baseDir = 'docs'): string {
    return `${baseDir}/${this.id}.json`
  }

  get filename() {
    return `${this.id}.json`
  }

  get createdAtFormatted() {
    return format(this.raw.createdAt, 'yyyy-MM-dd HH:mm')
  }
  get updatedAtFormatted() {
    return format(this.raw.updatedAt, 'yyyy-MM-dd HH:mm')
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
