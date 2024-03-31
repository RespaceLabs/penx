import { LOCAL_USER_ID } from '@penx/constants'
import { EditorMode, ISpace } from '@penx/model-types'
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

  get color() {
    return this.raw.color
  }

  get syncServerId() {
    return this.raw.syncServerId || ''
  }

  get syncServerUrl() {
    return this.raw.syncServerUrl || ''
  }

  get syncServerAccessToken() {
    return this.raw.syncServerAccessToken || ''
  }

  get isOutliner() {
    return this.raw.editorMode === EditorMode.OUTLINER
  }

  get isLocal() {
    return this.raw.userId === LOCAL_USER_ID
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
