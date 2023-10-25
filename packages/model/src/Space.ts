import { ISpace } from '@penx/types'
import { Settings } from './Settings'
import { Snapshot } from './Snapshot'
import { GithubInfo } from './User'

export class Space {
  settings: Settings

  snapshot: Snapshot

  constructor(private raw: ISpace) {
    this.settings = new Settings(raw.settings)
    this.snapshot = new Snapshot(raw)
  }

  get id() {
    return this.raw.id
  }

  get name() {
    return this.raw.name
  }

  get children() {
    return this.raw.children || []
  }

  get isActive() {
    return this.raw.isActive
  }

  get activeNodeId() {
    return this.raw.activeNodeId
  }

  get filename() {
    return `${this.id}.json`
  }

  get syncName() {
    return 'space.json'
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
