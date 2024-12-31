import Dexie, { Table } from 'dexie'
import { IAsset } from '../model/IAsset'
import { IBlock } from '../model/IBlock'
import { IPage } from '../model/IPage'

export class PenxDB extends Dexie {
  asset!: Table<IAsset, string>
  block!: Table<IBlock, string>
  page!: Table<IPage, string>

  constructor() {
    super('penx-local')
    this.version(2).stores({
      // Primary key and indexed props
      asset: 'id, hash',
    })
  }
}

export const penxDB = new PenxDB()
