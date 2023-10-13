import { ChangeType, ISpace } from '@penx/local-db'
import { Settings } from './Settings'

export class Space {
  settings: Settings

  constructor(private raw: ISpace) {
    this.settings = new Settings(raw.settings)
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

  get commit() {
    return {
      sha: this.raw.commitSha,
      date: this.raw.commitDate,
      timestamp: this.raw.commitDate?.valueOf(),
    }
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
    }
  }

  stringify(): string {
    return JSON.stringify(this.toJSON(), null, 2)
  }
}
