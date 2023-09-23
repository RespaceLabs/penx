import Dexie, { Table } from 'dexie'
import { getNewDoc } from './getNewDoc'
import { getNewSpace } from './getNewSpace'
import { IDoc } from './IDoc'
import { ISpace } from './ISpace'

export class PenxDB extends Dexie {
  space!: Table<ISpace, string>
  doc!: Table<IDoc, string>
  constructor() {
    super('PenxDB')
    this.version(1).stores({
      // Primary key and indexed props
      space: 'id, name',
      doc: 'id, spaceId',
    })
  }

  init = async () => {
    const count = await this.space.count()
    if (count === 0) {
      await this.createSpace('First Space')
    }
    const space = await this.space.toCollection().first()
    return space!
  }

  createSpace = async (name: string) => {
    return this.transaction('rw', this.space, this.doc, async () => {
      const newSpace = getNewSpace(name)
      const spaceId = newSpace.id

      await this.space.add(newSpace)

      const doc = getNewDoc(spaceId)

      await this.doc.add(doc)

      await this.space.where('id').notEqual(spaceId).modify({
        isActive: false,
      })

      await this.space.update(spaceId, {
        isActive: true,
        activeDocId: doc.id,
        catalogue: [
          {
            id: doc.id,
            isFolded: false,
            name: doc.title,
            type: 0,
          },
        ],
      })

      const space = await this.space.get(spaceId)!
      return space
    })
  }

  selectSpace = async (spaceId: string) => {
    await this.space.where('id').notEqual(spaceId).modify({
      isActive: false,
    })

    await this.space.update(spaceId, {
      isActive: true,
      updatedAt: new Date(),
    })
  }

  listSpaces = () => {
    return this.space.toArray()
  }

  getSpace = (spaceId: string) => {
    return this.space.get(spaceId)
  }

  updateSpace = (spaceId: string, space: Partial<ISpace>) => {
    return this.space.update(spaceId, space)
  }

  selectDoc = async (spaceId: string, docId: string) => {
    return this.transaction('rw', this.space, this.doc, async () => {
      await this.space.update(spaceId, {
        activeDocId: docId,
        updatedAt: new Date(),
      })

      const doc = await this.doc.get(docId)
      return doc
    })
  }

  createDoc(doc: IDoc) {
    return this.doc.add(doc)
  }

  getDoc = (docId: string) => {
    return this.doc.get(docId)
  }

  updateDoc = (docId: string, doc: Partial<IDoc>) => {
    return this.doc.update(docId, doc)
  }

  queryDocByIds = (docIds: string[]) => {
    return db.doc.where('id').anyOf(docIds).toArray()
  }

  deleteDocByIds = (docIds: string[]) => {
    return db.doc.where('id').anyOf(docIds).delete()
  }
}

export const db = new PenxDB()
