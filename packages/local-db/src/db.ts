import { IS_DB_OPENED, isServer } from '@penx/constants'
import { Database } from '@penx/indexeddb'
import { getNewDoc } from './getNewDoc'
import { getNewSpace } from './getNewSpace'
import { IDoc } from './IDoc'
import { ISpace } from './ISpace'

if (!isServer) {
  Object.defineProperty(window, IS_DB_OPENED, {
    value: false,
    writable: true,
    configurable: true,
    enumerable: true,
  })
  const originalOpen = indexedDB.open
  indexedDB.open = function (name, version) {
    if (window.__IS_DB_OPENED__) {
      // throw new Error(`IndexedDB is already opened ${name}`)
      return {} as any // TODO:
    }

    const result = originalOpen.call(indexedDB, name, version)

    window[IS_DB_OPENED] = true

    Object.defineProperty(window, IS_DB_OPENED, {
      value: true,
      writable: false,
      configurable: false,
      enumerable: true,
    })
    return result
  }
}

const database = new Database({
  version: 1,
  name: 'PenxDB',
  // indexedDB: isServer ? undefined : window.indexedDB,
  tables: [
    {
      name: 'space',
      primaryKey: {
        name: 'id',
        autoIncrement: false,
        unique: true,
      },
      indexes: {
        name: {
          unique: false,
        },
      },
      timestamps: true,
    },
    {
      name: 'doc',
      primaryKey: {
        name: 'id',
        autoIncrement: false,
        unique: true,
      },
      indexes: {
        spaceId: {
          unique: false,
        },
      },
      timestamps: true,
    },
  ],
})

class DB {
  database = database

  get space() {
    return database.useModel<ISpace>('space')
  }

  get doc() {
    return database.useModel<IDoc>('doc')
  }

  init = async () => {
    const count = (await this.space.selectAll()).length
    if (count === 0) {
      await this.createSpace('First Space')
    }
    // const space = await this.space.toCollection().first()
    const space = (await this.space.selectAll())[0]
    return space!
  }

  createSpace = async (name: string) => {
    const newSpace = getNewSpace(name)
    const spaceId = newSpace.id

    await this.space.insert(newSpace)

    const doc = getNewDoc(spaceId)

    await this.doc.insert(doc)

    const spaces = await this.listSpaces()

    for (const space of spaces) {
      await this.space.updateByPk(space.id, {
        isActive: false,
      })
    }

    await this.space.updateByPk(spaceId, {
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

    const space = await this.space.selectByPk(spaceId)!
    return space
  }

  selectSpace = async (spaceId: string) => {
    const spaces = await this.listSpaces()

    for (const space of spaces) {
      await this.space.updateByPk(space.id, {
        isActive: false,
      })
    }

    await this.space.updateByPk(spaceId, {
      isActive: true,
    })
  }

  listSpaces = () => {
    return this.space.selectAll()
  }

  getSpace = (spaceId: string) => {
    return this.space.selectByPk(spaceId)
  }

  updateSpace = (spaceId: string, space: Partial<ISpace>) => {
    return this.space.updateByPk(spaceId, space)
  }

  selectDoc = async (spaceId: string, docId: string) => {
    await this.space.updateByPk(spaceId, {
      activeDocId: docId,
    })

    const doc = await this.doc.selectByPk(docId)
    return doc
  }

  createDoc(doc: IDoc) {
    return this.doc.insert(doc)
  }

  getDoc = (docId: string) => {
    return this.doc.selectByPk(docId)
  }

  updateDoc = (docId: string, doc: Partial<IDoc>) => {
    return this.doc.updateByPk(docId, doc)
  }

  queryDocByIds = (docIds: string[]) => {
    const promises = docIds.map((id) => this.space.selectByPk(id))
    return Promise.all(promises)
  }

  deleteDocByIds = (docIds: string[]) => {
    const promises = docIds.map((id) => this.space.deleteByPk(id))
    return Promise.all(promises)
  }
}

export const db = new DB()
