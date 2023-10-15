import { nanoid } from 'nanoid'
import { Database } from '@penx/indexeddb'
import { Space } from '@penx/model'
import { DocStatus, IDoc, IExtension, IFile, ISpace } from '@penx/types'
import { getNewDoc } from './getNewDoc'
import { getNewSpace } from './getNewSpace'
import { tableSchema } from './table-schema'

const initialValue = [
  {
    type: 'p',
    id: nanoid(),
    children: [{ text: '' }],
  },
]

const database = new Database({
  version: 1,
  name: 'PenxDB',
  // indexedDB: isServer ? undefined : window.indexedDB,
  tables: tableSchema,
})

class DB {
  database = database

  get space() {
    return database.useModel<ISpace>('space')
  }

  get doc() {
    return database.useModel<IDoc>('doc')
  }

  get file() {
    return database.useModel<IFile>('file')
  }

  get extension() {
    return database.useModel<IExtension>('extension')
  }

  init = async () => {
    const count = await this.space.count()
    if (count === 0) {
      const space = await this.createSpace('First Space')
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

    await this.createDoc(doc)

    const spaces = await this.listSpaces()

    for (const space of spaces) {
      await this.space.updateByPk(space.id, {
        isActive: false,
      })
    }

    await this.space.updateByPk(spaceId, {
      isActive: true,
      activeDocId: doc.id,
    })

    const space = await this.space.selectByPk(spaceId)!
    return space as ISpace
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
    return this.space.selectByPk(spaceId) as any as Promise<ISpace>
  }

  getActiveSpace = async () => {
    const spaces = await this.listSpaces()
    const space = spaces.find((space) => space.isActive)
    return space!
  }

  updateSpace = (spaceId: string, space: Partial<ISpace>) => {
    return this.space.updateByPk(spaceId, space)
  }

  selectDoc = async (spaceId: string, docId: string) => {
    await this.space.updateByPk(spaceId, {
      activeDocId: docId,
    })

    // update openedAt
    await this.updateDoc(docId, { openedAt: Date.now() })

    const doc = await this.doc.selectByPk(docId)
    return doc
  }

  createDoc = async (doc: Partial<IDoc>) => {
    const newDoc = await this.doc.insert({
      id: nanoid(),
      status: DocStatus.NORMAL,
      openedAt: Date.now(),
      content: JSON.stringify(initialValue),
      ...doc,
    })

    await this.updateSnapshot(newDoc.id, 'add', newDoc)

    return newDoc
  }

  getDoc = (docId: string) => {
    return this.doc.selectByPk(docId)
  }

  private updateSnapshot = async (
    docId: string,
    action: 'add' | 'delete' | 'update',
    doc?: IDoc,
  ) => {
    if (!doc) {
      doc = await this.getDoc(docId)
    }

    const space = await this.getSpace(doc.spaceId)

    const spaceModel = new Space(space)
    spaceModel.snapshot[action](docId, doc)

    await this.updateSpace(space.id, {
      snapshot: spaceModel.snapshot.toJSON(),
    })
  }

  updateDoc = async (docId: string, data: Partial<IDoc>) => {
    const newDoc = await this.doc.updateByPk(docId, {
      ...data,
      updatedAt: Date.now(),
    })

    await this.updateSnapshot(docId, 'update', newDoc)

    return newDoc
  }

  trashDoc = async (docId: string) => {
    return await this.updateDoc(docId, {
      status: DocStatus.TRASHED,
    })
  }

  restoreDoc = (docId: string) => {
    return this.updateDoc(docId, {
      status: DocStatus.NORMAL,
    })
  }

  deleteDoc = async (docId: string) => {
    await this.updateSnapshot(docId, 'delete')
    return this.doc.deleteByPk(docId)
  }

  listDocsBySpaceId = async (spaceId: string) => {
    return this.doc.select({
      where: {
        spaceId,
      },
    })
  }

  listNormalDocs = async (spaceId: string) => {
    return this.doc.select({
      where: {
        spaceId,
        status: DocStatus.NORMAL,
      },
    })
  }

  listTrashedDocs = async (spaceId: string) => {
    return this.doc.select({
      where: {
        spaceId,
        status: DocStatus.TRASHED,
      },
    })
  }

  listDocByIds = (docIds: string[]) => {
    const promises = docIds.map((id) => this.doc.selectByPk(id))
    return Promise.all(promises) as any as Promise<IDoc[]>
  }

  deleteDocByIds = (docIds: string[]) => {
    const promises = docIds.map((id) => this.space.deleteByPk(id))
    return Promise.all(promises)
  }

  createExtension(extension: IExtension) {
    return this.extension.insert(extension)
  }

  getExtension = (extensionId: string) => {
    return this.extension.selectByPk(extensionId)
  }

  updateExtension = (extensionId: string, plugin: Partial<IExtension>) => {
    return this.extension.updateByPk(extensionId, plugin)
  }

  installExtension = async (extension: Partial<IExtension>) => {
    const list = await this.extension.select({
      where: {
        spaceId: extension.spaceId!,
        slug: extension.slug!,
      },
    })

    if (list?.length) {
      const ext = list[0]!
      return this.extension.updateByPk(ext.id, {
        ...ext,
        ...extension,
      })
    }

    return this.extension.insert({
      id: nanoid(),
      ...extension,
    })
  }

  listExtensions = async () => {
    return (await this.extension.selectAll()) as IExtension[]
  }

  createFile(file: Partial<IFile>) {
    return this.file.insert({
      ...file,
      id: nanoid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  }

  getFile = (id: string) => {
    return this.file.selectByPk(id)
  }
}

export const db = new DB()
