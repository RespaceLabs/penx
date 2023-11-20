import { format } from 'date-fns'
import { atom, createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { SyncStatus } from '@penx/constants'
import { PenxEditor } from '@penx/editor-common'
import { emitter } from '@penx/event'
import { db } from '@penx/local-db'
import { Node, User } from '@penx/model'
import { INode, ISpace, NodeType } from '@penx/model-types'
import { commands } from './constants'
import { Command, ExtensionStore, RouteName, RouterStore } from './types'

export const spacesAtom = atom<ISpace[]>([])

export const nodeAtom = atom(null as any as INode)

export const nodesAtom = atom<INode[]>([])

export const activeNodesAtom = atom<INode[]>([])

export const editorsAtom = atom<Map<number, PenxEditor>>(new Map())

export const syncStatusAtom = atom<SyncStatus>(SyncStatus.NORMAL)

export const commandsAtom = atom<Command[]>(commands)

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

  setActiveNodes(nodes: INode[]) {
    return store.set(activeNodesAtom, nodes)
  },

  getActiveNodes() {
    return store.get(activeNodesAtom)
  },

  setFirstActiveNodes(node: INode) {
    const [_, ...activeNodes] = this.getActiveNodes()
    const newActiveNodes = [node, ...activeNodes]
    this.setActiveNodes([...newActiveNodes])
    return newActiveNodes
  },

  getEditor(index: number) {
    const editors = store.get(editorsAtom)
    return editors.get(index)!
  },

  setEditor(index: number, editor: PenxEditor) {
    const editors = store.get(editorsAtom)
    editors.set(index, editor)
    store.set(editorsAtom, editors)
  },

  getNode() {
    return store.get(nodeAtom)
  },

  findNode(id: string) {
    const nodes = store.getNodes()
    return nodes.find((node) => node.id === id)
  },
  getDatabaseByName(tagName: string) {
    const nodes = store.getNodes()

    let databaseNode = nodes.find(
      (node) => node.type === NodeType.DATABASE && node.props.name === tagName,
    )

    return databaseNode
  },

  getCells(databaseId: string) {
    const nodes = store.getNodes()
    let cells = nodes.filter(
      (node) => node.type === NodeType.CELL && node.parentId === databaseId,
    )
    return cells
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
    //
  },

  async selectNode(node: INode) {
    const router = store.get(routerAtom)
    if (router.name !== 'NODE') this.routeTo('NODE')
    const newActiveNodes = this.setFirstActiveNodes(node)
    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeIds: newActiveNodes.map((node) => node.id),
    })
  },

  async selectInbox() {
    const space = this.getActiveSpace()
    let node = await db.getInboxNode(space.id)

    this.reloadNode(node)
    this.routeTo('NODE')
    const activeNodes = this.setFirstActiveNodes(node)

    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeIds: activeNodes.map((node) => node.id),
    })
  },

  async selectTagBox() {
    const space = this.getActiveSpace()
    let node = await db.getDatabaseRootNode(space.id)

    this.reloadNode(node)
    this.routeTo('NODE')

    const activeNodes = this.setFirstActiveNodes(node)

    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeIds: activeNodes.map((node) => node.id),
    })
  },

  async selectTrash() {
    const space = this.getActiveSpace()
    let node = await db.getTrashNode(space.id)

    this.reloadNode(node)
    this.routeTo('NODE')

    const activeNodes = this.setFirstActiveNodes(node)

    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeIds: activeNodes.map((node) => node.id),
    })
  },

  // select the space root node
  async selectSpaceNode() {
    const space = this.getActiveSpace()
    let node = await db.getSpaceNode(space.id)

    this.reloadNode(node)
    this.routeTo('NODE')

    const activeNodes = this.setFirstActiveNodes(node)

    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeIds: activeNodes.map((node) => node.id),
    })
  },

  async restoreNode(id: string) {},

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
      (node) => node.type === NodeType.DAILY && node.props.date === dateStr,
    )
    const space = this.getActiveSpace()
    const dailyRoot = await db.getDailyRootNode(space.id)

    if (!dateNode) {
      dateNode = await db.createDailyNode({
        parentId: dailyRoot.id,
        spaceId: space.id,
        type: NodeType.DAILY,
        props: { date: dateStr },
      })
    }
    const newNodes = await db.listNormalNodes(space.id)

    const activeNodes = this.setFirstActiveNodes(dateNode)

    this.setNodes(newNodes)
    this.reloadNode(dateNode)
    this.routeTo('NODE')

    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeIds: activeNodes.map((node) => node.id),
    })
  },

  async createNodeToToday(text: string) {
    const space = this.getActiveSpace()
    const { todayNode } = await db.addNodeToToday(space.id, text)
    const nodes = await db.listNormalNodes(space.id)

    this.routeTo('NODE')
    this.setNodes(nodes)
    this.reloadNode(todayNode)

    this.setFirstActiveNodes(todayNode)
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
    const nodes = await db.listNormalNodes(space.id)

    const rootNode = nodes.find((n) => new Node(n).isRootNode)!

    // update space root not snapshot
    await db.updateSnapshot(rootNode, 'update', rootNode)

    this.routeTo('NODE')
    this.setNodes(nodes)
    this.reloadNode(node)

    const activeNodes = this.setFirstActiveNodes(node)

    await db.updateSpace(space.id, {
      activeNodeIds: activeNodes.map((node) => node.id),
    })
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

  async deleteRow(rowId: string) {
    await db.deleteRow(rowId)
  },

  async createSpace(input: Partial<ISpace>) {
    let space = await db.createSpace(input)
    const spaces = await db.listSpaces()

    const nodes = await db.listNormalNodes(space.id)

    space = await db.getSpace(space.id)
    const activeNodes = nodes.filter((n) => space.activeNodeIds.includes(n.id))

    this.routeTo('NODE')
    this.setNodes(nodes)
    this.setSpaces(spaces)
    // this.reloadNode()
    this.setActiveNodes(activeNodes)
    return space
  },

  async selectSpace(id: string) {
    await db.selectSpace(id)
    const spaces = await db.listSpaces()
    const nodes = await db.listNormalNodes(id)
    const space = await db.getActiveSpace()
    const activeNodes = nodes.filter((n) => space.activeNodeIds.includes(n.id))

    this.setSpaces(spaces)
    this.setNodes(nodes)
    this.setActiveNodes(activeNodes)
    return space
  },

  async updateSpace(id: string, data: Partial<ISpace>) {
    await db.updateSpace(id, data)
    const spaces = await db.listSpaces()
    this.setSpaces(spaces)
  },
})
