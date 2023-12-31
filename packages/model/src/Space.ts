import { PENX_101 } from '@penx/constants'
import { ISpace } from '@penx/model-types'
import { PageSnapshot } from './PageSnapshot'
import { Settings } from './Settings'
import { GithubInfo } from './User'

export class Space {
  snapshot: PageSnapshot

  constructor(public raw: ISpace) {
    this.snapshot = new PageSnapshot(this.raw)
  }

  get id() {
    return this.raw.id
  }

  get name() {
    return this.raw.name
  }

  get password() {
    return this.raw.password || ''
  }

  get color() {
    return this.raw.color
  }

  get isActive() {
    return this.raw.isActive
  }

  get encrypted() {
    return this.raw.encrypted
  }

  get isSpace101() {
    return this.id === PENX_101
  }

  get filename() {
    return `${this.id}.json`
  }

  get filePath() {
    return `${this.id}/space.json`
  }

  get pageSnapshot() {
    return this.raw.pageSnapshot
  }

  get updatedAtTimestamp() {
    return new Date(this.raw.updatedAt).valueOf()
  }

  getFullPath(baseDir = 'spaces'): string {
    return `${baseDir}/${this.id}.json`
  }

  toJSON() {
    return {
      ...this.raw,
    }
  }

  stringify(): string {
    return JSON.stringify(this.toJSON(), null, 2)
  }
}
