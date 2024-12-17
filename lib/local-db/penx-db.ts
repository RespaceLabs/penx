import { INode, NodeType } from '@/lib/model'
import Dexie, { Table } from 'dexie'
import { getCommonNode } from './libs/getCommonNode'

export class PenxDB extends Dexie {
  node!: Table<INode, string>

  constructor() {
    super('penx-local')
    this.version(2).stores({
      // Primary key and indexed props
      node: 'id, userId, databaseId, type, date, [type+userId+databaseId], [type+userId], [type+databaseId]',
    })
  }
}

export const penxDB = new PenxDB()
