import { ISpace } from '@penx/model-types'

export interface SnapshotDiffResult {
  isEqual: boolean
  added: string[]
  deleted: string[]
  updated: string[]
}

export class PageSnapshot {
  map: Record<string, string> = {}

  version: number

  constructor(public space: ISpace) {
    this.map = space.pageSnapshot.pageMap || {}
    this.version = space.pageSnapshot.version || 0
  }

  updateVersion = (v: number) => {
    this.version = v
  }

  diff(
    localMap: Record<string, string>,
    serverSnapshot: ISpace['pageSnapshot'],
    type: 'PUSH' | 'PULL' = 'PUSH',
  ): SnapshotDiffResult {
    const { pageMap: serverMap } = serverSnapshot

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
