import Dexie, { Table } from 'dexie'
import { IAsset } from '../model/IAsset'
import { IBlock } from '../model/IBlock'
import { IPage } from '../model/IPage'
import { uniqueId } from '../unique-id'

class LocalDB extends Dexie {
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

  async addAsset(hash: string, file: File) {
    const asset = await this.asset.where({ hash }).first()
    if (asset) return
    return this.asset.add({
      id: uniqueId(),
      hash,
      file,
    })
  }
}

export const localDB = new LocalDB()
