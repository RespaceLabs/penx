import { ISpace } from '@penx/model-types'
import { Settings } from './Settings'
import { Snapshot } from './Snapshot'
import { GithubInfo } from './User'

export class Space {
  snapshot: Snapshot

  constructor(private raw: ISpace) {
    this.snapshot = new Snapshot(raw)
  }

  get id() {
    return this.raw.id
  }

  get name() {
    return this.raw.name
  }

  get color() {
    return this.raw.color
  }

  get isActive() {
    return this.raw.isActive
  }

  get isSpace101() {
    return this.id === 'penx-101'
  }

  get filename() {
    return `${this.id}.json`
  }

  get filePath() {
    return `${this.id}/space.json`
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
      snapshot: this.snapshot.toJSON(),
    }
  }

  stringify(version?: number): string {
    if (typeof version !== 'undefined') {
      this.snapshot.updateVersion(version)
    }
    return JSON.stringify(this.toJSON(), null, 2)
  }
}
