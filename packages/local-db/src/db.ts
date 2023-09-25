import { nanoid } from 'nanoid'
import { Database } from '@penx/indexeddb'
import { getNewDoc } from './getNewDoc'
import { getNewSpace } from './getNewSpace'
import { IDoc } from './IDoc'
import { IPlugin } from './IPlugin'
import { ISpace } from './ISpace'

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
    {
      name: 'plugin',
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

  get plugin() {
    return database.useModel<IPlugin>('plugin')
  }

  init = async () => {
    const count = await this.space.count()
    if (count === 0) {
      const space = await this.createSpace('First Space')
      await this.initPlugins(space.id)
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
    return space as ISpace
  }

  initPlugins = async (spaceId: string) => {
    await this.createPlugin({
      id: nanoid(),
      spaceId,
      code: `
function activate(ctx) {
  ctx.createSettings([]);
  ctx.registerCommand("hello-world", () => {
  });
}
export {
  activate
};
      `,
      manifest: {
        id: 'plugin-1',
        name: 'plugin-1',
        version: '0.0.1',
        description: '',
      },
    })

    await this.createPlugin({
      id: nanoid(),
      spaceId,
      code: `
function activate(ctx) {
  ctx.createSettings([]);
  ctx.registerCommand("hello-world", () => {
  });
}
export {
  activate
};
      `,
      manifest: {
        id: 'plugin-2',
        name: 'plugin-2',
        version: '0.0.1',
        description: '',
      },
    })
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

  createDoc(doc: Partial<IDoc>) {
    return this.doc.insert(doc)
  }

  getDoc = (docId: string) => {
    return this.doc.selectByPk(docId)
  }

  updateDoc = (docId: string, doc: Partial<IDoc>) => {
    return this.doc.updateByPk(docId, doc)
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

  createPlugin(plugin: IPlugin) {
    return this.plugin.insert(plugin)
  }

  getPlugin = (pluginId: string) => {
    return this.plugin.selectByPk(pluginId)
  }

  updatePlugin = (pluginId: string, plugin: Partial<IPlugin>) => {
    return this.plugin.updateByPk(pluginId, plugin)
  }

  listPlugins = () => {
    return this.plugin.selectAll()
  }
}

export const db = new DB()
