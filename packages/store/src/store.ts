import { format } from 'date-fns'
import { atom, createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { SyncStatus } from '@penx/constants'
import { emitter } from '@penx/event'
import { db } from '@penx/local-db'
import { Node, User } from '@penx/model'
import { INode, ISpace, NodeType } from '@penx/model-types'
import { Command, ExtensionStore, RouteName, RouterStore } from './types'

// export const nodeAtom = atomWithStorage('node', null as any as INode)
export const nodeAtom = atom(null as any as INode)
export const nodesAtom = atom<INode[]>([])

export const spacesAtom = atom<ISpace[]>([])

export const syncStatusAtom = atom<SyncStatus>(SyncStatus.NORMAL)

export const commandsAtom = atom<Command[]>([
  {
    id: 'add-document',
    name: 'Add document',
    handler: () => {
      emitter.emit('ADD_DOCUMENT')
    },
  },

  {
    id: 'export-to-markdown',
    name: 'export to markdown',
    handler: () => {
      emitter.emit('ADD_DOCUMENT')
    },
  },
])

export const routerAtom = atomWithStorage('Router', {
  name: 'NODE',
} as RouterStore)

export const extensionStoreAtom = atom<ExtensionStore>({})

export const userAtom = atom<User>(null as any as User)

export const store = Object.assign(createStore(), {
  getSpaces() {
    return store.get(spacesAtom)
  },

  getActiveSpace() {
    const spaces = store.getSpaces()
    return spaces.find((space) => space.isActive)!
  },

  setSpaces(spaces: ISpace[]) {
    return store.set(spacesAtom, spaces)
  },

  getNodes() {
    return store.get(nodesAtom)
  },

  setNodes(nodes: INode[]) {
    return store.set(nodesAtom, nodes)
  },

  getNode() {
    return store.get(nodeAtom)
  },

  setNode(node: INode) {
    return store.set(nodeAtom, node)
  },

  getUser() {
    return store.get(userAtom)
  },

  setUser(user: User) {
    return store.set(userAtom, user)
  },

  routeTo(name: RouteName, params: Record<string, any> = {}) {
    const current = store.get(routerAtom)
    if (name === current.name) return
    return store.set(routerAtom, {
      name,
      params,
    })
  },

  async trashNode(id: string) {
    const space = this.getActiveSpace()
    await db.trashNode(id)

    const nodes = await db.listNodesBySpaceId(space.id)

    if (nodes.length) {
      this.reloadNode(nodes[0])
    }
    this.setNodes(nodes)
  },

  async selectNode(node: INode) {
    this.routeTo('NODE')
    this.reloadNode(node)
    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeId: node.id,
    })
  },

  async selectInbox() {
    const space = this.getActiveSpace()
    let node = await db.getInboxNode(space.id)

    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeId: node.id,
    })

    this.reloadNode(node)
    this.routeTo('NODE')
  },

  async selectTagBox() {
    const space = this.getActiveSpace()
    let node = await db.getDatabaseRootNode(space.id)

    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeId: node.id,
    })

    this.reloadNode(node)
    this.routeTo('NODE')
  },

  async selectTrash() {
    const space = this.getActiveSpace()
    let node = await db.getTrashNode(space.id)

    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeId: node.id,
    })

    this.reloadNode(node)
    this.routeTo('NODE')
  },

  // select the space root node
  async selectSpaceNode() {
    const space = this.getActiveSpace()
    let node = await db.getSpaceNode(space.id)

    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeId: node.id,
    })

    this.reloadNode(node)
    this.routeTo('NODE')
  },

  async restoreNode(id: string) {
    const space = this.getActiveSpace()
    await db.restoreNode(id)
    const nodes = await db.listNodesBySpaceId(space.id)
    this.setNode(nodes[0])
    this.setNodes(nodes)
  },

  async deleteNode(id: string) {
    const space = this.getActiveSpace()
    await db.deleteNode(id)
    const nodes = await db.listNodesBySpaceId(space.id)
    this.setNode(nodes[0])
    this.setNodes(nodes)
  },

  reloadNode(node: INode) {
    this.setNode(null as any)

    // for rerender editor
    setTimeout(() => {
      this.setNode(node)
    }, 0)
  },

  async selectDailyNote(date: Date = new Date()) {
    const dateStr = format(date, 'yyyy-MM-dd')
    const nodes = store.getNodes()
    let dateNode = nodes.find(
      (node) =>
        node.type === NodeType.DAILY_NOTE && node.props.date === dateStr,
    )

    if (!dateNode) {
      await this.createPageNode({
        type: NodeType.DAILY_NOTE,
        props: { date: dateStr },
      })
    } else {
      await db.updateSpace(dateNode.spaceId, { activeNodeId: dateNode.id })
      this.routeTo('NODE')
      this.setNodes(nodes)
      this.reloadNode(dateNode)
    }
  },

  async createPageNode(input: Partial<INode> = {}) {
    const space = this.getActiveSpace()
    const node = await db.createPageNode(
      {
        collapsed: true,
        spaceId: space.id,
        ...input,
      },
      space,
    )
    await db.updateSpace(space.id, { activeNodeId: node.id })
    const nodes = await db.listNormalNodes(space.id)

    const rootNode = nodes.find((n) => new Node(n).isRootNode)!

    // update space root not snapshot
    await db.updateSnapshot(rootNode, 'update', rootNode)

    this.routeTo('NODE')
    this.setNodes(nodes)
    this.reloadNode(node)
  },

  async createDatabase(tagName: string) {
    const nodes = store.getNodes()

    let databaseNode = nodes.find(
      (node) => node.type === NodeType.DATABASE && node.props.name === tagName,
    )

    if (!databaseNode) {
      databaseNode = await db.createDatabase(tagName)
    }

    const newNodes = await db.listNormalNodes(databaseNode.spaceId)
    this.setNodes(newNodes)

    return databaseNode
  },

  async createSpace(input: Partial<ISpace>) {
    let space = await db.createSpace(input)
    const spaces = await db.listSpaces()

    const nodes = await db.listNormalNodes(space.id)

    space = await db.getSpace(space.id)
    const node = await db.getNode(space.activeNodeId!)

    this.routeTo('NODE')
    this.setNodes(nodes)
    this.setSpaces(spaces)
    this.reloadNode(node)
    return space
  },

  async selectSpace(id: string) {
    await db.selectSpace(id)
    const spaces = await db.listSpaces()
    const nodes = await db.listNormalNodes(id)
    const space = await db.getActiveSpace()
    const nodeId = space.activeNodeId!
    const node = await db.getNode(nodeId)

    this.setSpaces(spaces)
    this.setNodes(nodes)
    this.reloadNode(node)
    return space
  },

  async updateSpace(id: string, data: Partial<ISpace>) {
    await db.updateSpace(id, data)
    const spaces = await db.listSpaces()
    this.setSpaces(spaces)
  },
})
