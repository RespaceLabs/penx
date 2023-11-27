import isEqual from 'react-fast-compare'
import { format } from 'date-fns'
import { atom, createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Transforms } from 'slate'
import { SyncStatus } from '@penx/constants'
import { PenxEditor } from '@penx/editor-common'
import { clearEditor } from '@penx/editor-transforms'
import { db } from '@penx/local-db'
import { Node, User } from '@penx/model'
import { INode, ISpace, NodeType } from '@penx/model-types'
import { nodeToSlate } from '@penx/serializer'
import { commands } from './constants'
import { SessionStore } from './stores/SessionStore'
import { Command, ExtensionStore, RouteName, RouterStore } from './types'

export const appLoadingAtom = atom(true)

export const spacesAtom = atom<ISpace[]>([])

export const nodesAtom = atom<INode[]>([])

export const activeNodesAtom = atom<INode[]>([])

export const editorsAtom = atom<Map<number, PenxEditor>>(new Map())

export const syncStatusAtom = atom<SyncStatus>(SyncStatus.NORMAL)

export const commandsAtom = atom<Command[]>(commands)

export const routerAtom = atomWithStorage('Router', {
  name: 'NODE',
} as RouterStore)

export const extensionStoreAtom = atom<ExtensionStore>({})

export const userAtom = atom<User>({} as User)

const baseStore = createStore()

export const store = Object.assign(baseStore, {
  session: new SessionStore(baseStore),
  getAppLoading() {
    return store.get(appLoadingAtom)
  },

  setAppLoading(loading: boolean) {
    return store.set(appLoadingAtom, loading)
  },

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

  getMainEditor() {
    const editors = store.get(editorsAtom)
    return editors.get(0)!
  },

  setEditor(index: number, editor: PenxEditor) {
    const editors = store.get(editorsAtom)
    editors.set(index, editor)
    store.set(editorsAtom, editors)
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

  getUser() {
    return store.get(userAtom)
  },

  setUser(user: User) {
    return store.set(userAtom, user)
  },

  getRouterName() {
    return store.get(routerAtom).name
  },

  routeTo(name: RouteName, params: Record<string, any> = {}) {
    const current = store.get(routerAtom)
    if (name === current.name) return
    return store.set(routerAtom, {
      name,
      params,
    })
  },

  async selectNode(node: INode, index = 0) {
    const router = store.get(routerAtom)
    if (router.name !== 'NODE') this.routeTo('NODE')

    const activeNodes = store.getActiveNodes()

    if (index === 0 && isEqual(activeNodes[0], node)) {
      console.log('is equal node')
      return
    }

    const editor = store.getEditor(index)
    clearEditor(editor)

    const nodes = store.getNodes()
    const value = nodeToSlate(node, nodes)

    Transforms.insertNodes(editor, value)
    const newActiveNodes = this.setFirstActiveNodes(node)
    await db.updateSpace(this.getActiveSpace().id, {
      activeNodeIds: newActiveNodes.map((node) => node.id),
    })
  },

  async selectInbox() {
    const space = this.getActiveSpace()
    let node = await db.getInboxNode(space.id)

    this.selectNode(node)
  },

  async selectTagBox() {
    const space = this.getActiveSpace()
    let node = await db.getDatabaseRootNode(space.id)

    this.selectNode(node)
  },

  async selectTrash() {
    const space = this.getActiveSpace()
    let node = await db.getTrashNode(space.id)

    this.selectNode(node)
  },

  // select the space root node
  async selectSpaceNode() {
    const space = this.getActiveSpace()
    let node = await db.getSpaceNode(space.id)

    this.selectNode(node)
  },

  async restoreNode(id: string) {},

  async deleteNode(id: string) {
    const space = this.getActiveSpace()
    await db.deleteNode(id)
    const nodes = await db.listNodesBySpaceId(space.id)
    this.setNodes(nodes)
  },

  async openInNewPanel(nodeId: string) {
    const nodes = store.getNodes()
    const node = nodes.find((n) => n.id === nodeId)!
    const activeNodes = store.getActiveNodes()

    const newActiveNodes = [...activeNodes, node]
    store.setActiveNodes([...newActiveNodes])

    const space = this.getActiveSpace()
    await db.updateSpace(space.id, {
      activeNodeIds: newActiveNodes.map((node) => node.id),
    })
  },

  async closePanel(index: number) {
    const activeNodes = store.getActiveNodes()
    const newActiveNodes = activeNodes.filter((_, i) => i !== index)
    store.setActiveNodes([...newActiveNodes])

    const space = this.getActiveSpace()
    await db.updateSpace(space.id, {
      activeNodeIds: newActiveNodes.map((node) => node.id),
    })
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

      console.log('goog......')

      // TODO: sync
    }
    const newNodes = await db.listNormalNodes(space.id)

    this.setNodes(newNodes)
    this.selectNode(dateNode)
  },

  async createNodeToToday(text: string) {
    const space = this.getActiveSpace()
    const { todayNode } = await db.addNodeToToday(space.id, text)
    const nodes = await db.listNormalNodes(space.id)

    this.setNodes(nodes)
    this.selectNode(todayNode)
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

    this.setNodes(nodes)
    this.selectNode(node)
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
    const activeNodes = space.activeNodeIds.map((id) => {
      return nodes.find((n) => n.id === id)!
    })

    this.routeTo('NODE')
    this.setNodes(nodes)
    this.setSpaces(spaces)
    this.selectNode(activeNodes[0])
    this.setActiveNodes(activeNodes)
    return space
  },

  async deleteSpace(spaceId: string) {
    await db.deleteSpace(spaceId)
    const spaces = await db.listSpaces()
    const space = await db.getActiveSpace()
    const nodes = await db.listNormalNodes(space.id)
    const activeNodes = space.activeNodeIds.map((id) => {
      return nodes.find((n) => n.id === id)!
    })

    this.routeTo('NODE')
    this.setNodes(nodes)
    this.setSpaces(spaces)
    this.selectNode(activeNodes[0])
    this.setActiveNodes(activeNodes)
  },

  async selectSpace(id: string) {
    await db.selectSpace(id)
    const spaces = await db.listSpaces()
    const nodes = await db.listNormalNodes(id)
    const space = await db.getActiveSpace()

    const activeNodes = space.activeNodeIds.map((id) => {
      return nodes.find((n) => n.id === id)!
    })

    this.setSpaces(spaces)
    this.setNodes(nodes)
    this.setActiveNodes(activeNodes)

    if (space.isCloud && !nodes.length) {
      store.routeTo('SET_PASSWORD')
    } else {
      this.selectNode(activeNodes[0])
    }
    return space
  },

  async updateSpace(id: string, data: Partial<ISpace>) {
    await db.updateSpace(id, data)
    const spaces = await db.listSpaces()
    this.setSpaces(spaces)
  },
})
