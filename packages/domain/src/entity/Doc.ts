import { format } from 'date-fns'
import { DocStatus, IDoc } from '@penx/local-db'

export class Doc {
  constructor(public raw: IDoc) {}

  get id(): string {
    return this.raw.id
  }

  get title(): string {
    return this.raw.title
  }

  get isTrashed() {
    return this.raw.status === DocStatus.TRASHED
  }

  getFullPath(baseDir = 'docs'): string {
    return `${baseDir}/${this.id}.json`
  }

  get filename() {
    return `${this.id}.json`
  }

  get createdAt() {
    return this.raw.createdAt
  }
  get updatedAt() {
    return this.raw.updatedAt
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
