import { ChangeType, ISpace } from '@penx/types'
import { Settings } from './Settings'
import { Snapshot } from './Snapshot'

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

  get isActive() {
    return this.raw.isActive
  }

  get activeDocId() {
    return this.raw.activeDocId
  }

  get filename() {
    return `${this.id}.json`
  }

  get syncName() {
    return 'space.json'
  }

  get changes() {
    return this.raw.changes
  }

  get updatedAtTimestamp() {
    return new Date(this.raw.updatedAt).valueOf()
  }

  getChangedDocIds(
    changeType: ChangeType[] = [ChangeType.ADD, ChangeType.UPDATE],
  ) {
    return Object.keys(this.changes).filter((id) =>
      changeType.includes(this.changes[id].type),
    )
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
