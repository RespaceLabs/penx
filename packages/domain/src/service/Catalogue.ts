import { nanoid } from 'nanoid'
import {
  CatalogueNode,
  CatalogueNodeType,
  CatalogueTree,
} from '@penx/catalogue'
import { db, IDoc, ISpace } from '@penx/local-db'
import { docAtom, spacesAtom, store } from '@penx/store'
import { ChangeService } from './ChangeService'

const initialValue = [
  {
    type: 'p',
    id: nanoid(),
    children: [{ text: '' }],
  },
]

export class Catalogue {
  changeService: ChangeService

  get spaceId() {
    return this.space.id
  }

  get nodes() {
    return this.tree.nodes
  }

  get docNodes() {
    return this.tree.flatten(CatalogueNodeType.DOC)
  }

  constructor(
    public space: ISpace,
    public tree: CatalogueTree,
  ) {
    this.changeService = new ChangeService(this.space)
  }

  private async updateCatalogueToDB() {
    await db.updateSpace(this.spaceId, {
      catalogue: this.tree.toJSON(),
    })
  }

  private async reloadSpaceStore() {
    const spaces = await db.listSpaces()
    store.set(spacesAtom, spaces)
    return spaces
  }

  // TODO:  should rename this method?
  moveNode = async (nodes: CatalogueNode[]) => {
    this.tree.nodes = nodes
    await this.updateCatalogueToDB()
    await this.reloadSpaceStore()
  }

  switchFolded = async (id: string) => {
    this.tree.switchFolded(id)
    await this.updateCatalogueToDB()
    await this.reloadSpaceStore()
  }

  updateEmoji = async (id: string, unified: string) => {
    this.tree.updateEmoji(id, unified)
    await this.updateCatalogueToDB()
  }

  updateNodeName = async (id: string, name: string) => {
    this.tree.updateNodeName(id, name)
    await this.updateCatalogueToDB()
    await this.reloadSpaceStore()
  }

  addNode = async (type: CatalogueNodeType, parentId = '') => {
    const id = nanoid()
    const isGroup = type === CatalogueNodeType.GROUP
    const name = isGroup ? 'New Group' : 'New Doc'

    const node = this.tree.addNode({ name, id, type }, parentId)

    if (node.isGroup) {
      await db.updateSpace(this.spaceId, {
        catalogue: this.tree.toJSON(),
      })

      await this.reloadSpaceStore()

      return
    }

    //  is Doc
    await db.updateSpace(this.spaceId, {
      activeDocId: id,
      catalogue: this.tree.toJSON(),
    })

    const newDoc: IDoc = {
      id,
      spaceId: this.spaceId,
      title: node.name,
      content: JSON.stringify(initialValue),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    await db.createDoc(newDoc)

    await this.changeService.add(id)

    await this.reloadSpaceStore()

    this.updateDocAtom(newDoc)
  }

  deleteNode = async (node: CatalogueNode) => {
    const { id } = node
    const deletedNode = this.tree.deleteNode(id)!

    let ids: string[] = [id]

    // if is group, delete all children doc id
    if (node.isGroup) {
      ids = this.tree
        .flatten(CatalogueNodeType.DOC, [deletedNode])
        .map((i) => i.id)
    }

    await db.deleteDocByIds(ids)

    await this.changeService.deleteMany(ids)

    await db.updateSpace(this.spaceId, {
      catalogue: this.tree.toJSON(),
      activeDocId: this.tree.firstDocNodeId,
    })

    // reload spaces
    const [doc, spaces] = await Promise.all([
      db.getDoc(this.tree.firstDocNodeId),
      db.listSpaces(),
    ])

    store.set(spacesAtom, spaces)

    if (doc) {
      this.updateDocAtom(doc!)
    }
  }

  selectNode = async (node: CatalogueNode) => {
    if (node.isGroup) {
      await this.switchFolded(node.id)
      return
    }
    const doc = await db.selectDoc(this.spaceId, node.id)
    await this.reloadSpaceStore()
    this.updateDocAtom(doc!)
  }

  private updateDocAtom(doc: IDoc) {
    store.set(docAtom, null as any)

    // for rerender editor
    setTimeout(() => {
      store.set(docAtom, doc!)
    }, 0)
  }
}
