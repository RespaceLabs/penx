import { ISpace } from '@penx/model-types'

export interface SnapshotDiffResult {
  isEqual: boolean
  added: string[]
  deleted: string[]
  updated: string[]
}

export class PageSnapshot {
  constructor(public space: ISpace) {}

  diff(
    curPageMap: Record<string, string>,
    prevPageMap: Record<string, string>,
  ): SnapshotDiffResult {
    const curIds = Object.keys(curPageMap)
    const prevIds = Object.keys(prevPageMap)

    let added = curIds.filter((item) => !prevIds.includes(item))
    let deleted = prevIds.filter((item) => !curIds.includes(item))

    const same = curIds.filter((item) => prevIds.includes(item))
    const updated: string[] = []
    for (const id of same) {
      if (curPageMap[id] !== prevPageMap[id]) {
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
