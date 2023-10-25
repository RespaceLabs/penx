import CryptoJS from 'crypto-js'
import { ISpace } from '@penx/types'

export interface SnapshotDiffResult {
  isEqual: boolean
  added: string[]
  deleted: string[]
  updated: string[]
}

export class Snapshot {
  repo: string

  // Record<nodeId, md5>
  map: Record<string, string> = {}

  version: number

  constructor(public space: ISpace) {
    this.map = space.snapshot.nodeMap || {}
    this.version = space.snapshot.version || 0
    this.repo = space.settings.sync.repo
  }

  md5Doc = (editorValue: any) => {
    return CryptoJS.MD5(JSON.stringify(editorValue)).toString()
  }

  add = (nodeId: string, editorValue: any) => {
    this.map[nodeId] = this.md5Doc(editorValue)
  }

  update = (nodeId: string, editorValue: any) => {
    this.map[nodeId] = this.md5Doc(editorValue)
    console.log('md5:', this.map[nodeId])
  }

  delete = (nodeId: string) => {
    delete this.map[nodeId]
  }

  toJSON() {
    return {
      version: this.version,
      nodeMap: this.map,
    }
  }

  updateVersion = (v: number) => {
    this.version = v
  }

  diff(serverSnapshot: ISpace['snapshot']): SnapshotDiffResult {
    const { map: localMap } = this
    const { nodeMap: serverMap } = serverSnapshot
    console.log('serverSnapshot:', serverSnapshot, 's:', this.toJSON())

    const localIds = Object.keys(localMap)
    const serverIds = Object.keys(serverMap)

    const added = localIds.filter((item) => !serverIds.includes(item))
    const same = localIds.filter((item) => serverIds.includes(item))
    const deleted = serverIds.filter((item) => !localIds.includes(item))
    const updated: string[] = []

    for (const id of same) {
      if (localMap[id] !== serverMap[id]) {
        updated.push(id)
      }
    }

    const isEqual =
      added.length === 0 && updated.length === 0 && deleted.length === 0

    return {
      isEqual,
      added,
      deleted,
      updated,
    }
  }
}
