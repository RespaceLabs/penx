import CryptoJS from 'crypto-js'
import { ISpace } from '@penx/types'

export interface SnapshotDiffResult {
  isEqual: boolean
  added: string[]
  deleted: string[]
  updated: string[]
}

export class Snapshot {
  // Record<nodeId, md5>
  map: Record<string, string> = {}

  version: number

  constructor(public space: ISpace) {
    this.map = space.snapshot.nodeMap || {}
    this.version = space.snapshot.version || 0
  }

  md5Doc = (editorValue: any) => {
    return CryptoJS.MD5(JSON.stringify(editorValue)).toString()
  }

  add = (id: string, editorValue: any) => {
    this.map[id] = this.md5Doc(editorValue)
  }

  update = (id: string, editorValue: any) => {
    this.map[id] = this.md5Doc(editorValue)
  }

  delete = (id: string) => {
    delete this.map[id]
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

  diff(
    serverSnapshot: ISpace['snapshot'],
    type: 'PUSH' | 'PULL' = 'PUSH',
  ): SnapshotDiffResult {
    const { map: localMap } = this
    const { nodeMap: serverMap } = serverSnapshot
    console.log('serverSnapshot--------:', serverSnapshot)
    console.log('localSnapshot:', this.toJSON())

    const localIds = Object.keys(localMap)
    const serverIds = Object.keys(serverMap)

    let added = localIds.filter((item) => !serverIds.includes(item))
    let deleted = serverIds.filter((item) => !localIds.includes(item))

    // swap
    if (type === 'PULL') {
      ;[added, deleted] = [deleted, added]
    }

    const same = localIds.filter((item) => serverIds.includes(item))
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
