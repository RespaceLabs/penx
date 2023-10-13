import { nanoid } from 'nanoid'
import { Database } from '@penx/indexeddb'
import { getNewDoc } from './getNewDoc'
import { getNewSpace } from './getNewSpace'
import { DocStatus, IDoc } from './interfaces/IDoc'
import { IExtension } from './interfaces/IExtension'
import { IFile } from './interfaces/IFile'
import { ISpace } from './interfaces/ISpace'
import { tableSchema } from './table-schema'

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
    await this.doc.updateByPk(docId, { openedAt: Date.now() })

    const doc = await this.doc.selectByPk(docId)
    return doc
  }

  createDoc(doc: Partial<IDoc>) {
    return this.doc.insert({
      ...doc,
      status: DocStatus.NORMAL,
      openedAt: Date.now(),
    })
  }

  getDoc = (docId: string) => {
    return this.doc.selectByPk(docId)
  }

  updateDoc = (docId: string, doc: Partial<IDoc>) => {
    return this.doc.updateByPk(docId, { ...doc, updatedAt: Date.now() })
  }

  trashDoc = (docId: string) => {
    return this.doc.updateByPk(docId, {
      status: DocStatus.DELETED,
    })
  }

  // TODO: should use cursor
  listDocsBySpaceId = async (spaceId: string) => {
    const docs = (await this.doc.selectAll()) as IDoc[]
    return docs.filter((d) => d.spaceId === spaceId)
  }

  queryDocByIds = (docIds: string[]) => {
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
