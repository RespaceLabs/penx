import Dexie, { Table } from 'dexie'
import { IExtension, IFile, INode, ISpace } from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'
import { getNewSpace } from './libs/getNewSpace'

export class PenxDB extends Dexie {
  space!: Table<ISpace, string>
  node!: Table<INode, string>
  file!: Table<IFile, string>
  extension!: Table<IExtension, string>

  constructor() {
    // super('PenxDB')
    super('penx-local')
    this.version(12).stores({
      // Primary key and indexed props
      space: 'id, name, userId',
      node: 'id, spaceId, databaseId, type, date, [type+spaceId+databaseId], [type+spaceId], [type+databaseId]',
      file: 'id, googleDriveFileId, fileHash',
      extension: 'id, slug',
    })
  }

  createExtension(extension: IExtension) {
    return this.extension.add(extension)
  }

  getExtension = (extensionId: string) => {
    return this.extension.get(extensionId)
  }

  upsertExtension = async (slug: string, data: Partial<IExtension>) => {
    console.log('upsert ext.......')

    const ext = await this.extension.where({ slug }).first()
    console.log('ext.........:', ext)

    if (!ext) {
      await this.createExtension({
        id: uniqueId(),
        spaceId: '',
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      } as IExtension)
    }
    console.log('upsertExtension', slug, data)
  }

  updateExtension = (extensionId: string, data: Partial<IExtension>) => {
    return this.extension.update(extensionId, data)
  }

  listExtensions = () => {
    return this.extension.toArray()
  }

  installExtension = async (extension: Partial<IExtension>) => {
    const list = await this.extension
      .where({
        spaceId: extension.spaceId!,
        slug: extension.slug!,
      })
      .toArray()

    if (list?.length) {
      const ext = list[0]!
      return this.extension.update(ext.id, {
        ...ext,
        ...extension,
      })
    }

    return this.extension.add({
      id: uniqueId(),
      ...extension,
    } as IExtension)
  }

  listExtensions = () => {
    return this.extension.toArray()
  }

  createFile = async (data: Omit<IFile, 'id'>): Promise<IFile> => {
    const newNodeId = await this.file.add({
      id: uniqueId(),
      ...data,
    })

    return this.file.get(newNodeId) as any as Promise<IFile>
  }
}

export const penxDB = new PenxDB()
