import { INode, NodeType } from '@/lib/model'
import Dexie, { Table } from 'dexie'
import { getCommonNode } from './libs/getCommonNode'

export class PlantreeDB extends Dexie {
  node!: Table<INode, string>

  constructor() {
    super('plantree')
    this.version(2).stores({
      // Primary key and indexed props
      node: 'id, userId, databaseId, type, date, [type+userId+databaseId], [type+userId], [type+databaseId]',
    })
  }
}

export const plantreeDB = new PlantreeDB()
