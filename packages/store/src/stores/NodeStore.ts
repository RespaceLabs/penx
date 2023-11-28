import isEqual from 'react-fast-compare'
import { format } from 'date-fns'
import { atom } from 'jotai'
import { Transforms } from 'slate'
import { clearEditor } from '@penx/editor-transforms'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, ISpace, NodeType } from '@penx/model-types'
import { nodeToSlate } from '@penx/serializer'
import { StoreType } from './store-types'

export const nodesAtom = atom<INode[]>([])

export const activeNodesAtom = atom<INode[]>([])

export class NodeStore {
  constructor(private store: StoreType) {}

  getNodes() {
    return this.store.get(nodesAtom)
  }

  setNodes(nodes: INode[]) {
    return this.store.set(nodesAtom, nodes)
  }

  setActiveNodes(nodes: INode[]) {
    return this.store.set(activeNodesAtom, nodes)
  }

  getActiveNodes() {
    return this.store.get(activeNodesAtom)
  }

  setFirstActiveNodes(node: INode) {
    const [_, ...activeNodes] = this.getActiveNodes()
    const newActiveNodes = [node, ...activeNodes]
    this.setActiveNodes([...newActiveNodes])
    return newActiveNodes
  }

  findNode(id: string) {
    const nodes = this.getNodes()
    return nodes.find((node) => node.id === id)
  }

  getDatabaseByName(tagName: string) {
    const nodes = this.getNodes()

    let databaseNode = nodes.find(
      (node) => node.type === NodeType.DATABASE && node.props.name === tagName,
    )

    return databaseNode
  }

  getCells(databaseId: string) {
    const nodes = this.getNodes()
    let cells = nodes.filter(
      (node) => node.type === NodeType.CELL && node.parentId === databaseId,
    )
    return cells
  }

  async selectNode(node: INode, index = 0) {
    if (!this.store.router.isNode()) this.store.router.toNode()

    const activeNodes = this.getActiveNodes()

    if (index === 0 && isEqual(activeNodes[0], node)) {
      console.log('is equal node')
      return
    }

    const editor = this.store.editor.getEditor(index)

    const nodes = this.getNodes()
    const value = nodeToSlate(node, nodes)

    // TODO: the good way  is to clear the editor, but now has bug
    this.setActiveNodes([])
    setTimeout(async () => {
      this.setActiveNodes([node])

      // clearEditor(editor)
      // Transforms.insertNodes(editor, value)

      const newActiveNodes = this.setFirstActiveNodes(node)

      await db.updateSpace(this.store.space.getActiveSpace().id, {
        activeNodeIds: newActiveNodes.map((node) => node.id),
      })
    }, 0)
  }

  async selectInbox() {
    const space = this.store.space.getActiveSpace()
    let node = await db.getInboxNode(space.id)

    this.selectNode(node)
  }

  async selectTagBox() {
    const space = this.store.space.getActiveSpace()
    let node = await db.getDatabaseRootNode(space.id)

    this.selectNode(node)
  }

  async selectTrash() {
    const space = this.store.space.getActiveSpace()
    let node = await db.getTrashNode(space.id)

    this.selectNode(node)
  }

  // select the space root node
  async selectSpaceNode() {
    const space = this.store.space.getActiveSpace()
    let node = await db.getSpaceNode(space.id)

    this.selectNode(node)
  }

  async deleteNode(id: string) {
    const space = this.store.space.getActiveSpace()
    await db.deleteNode(id)
    const nodes = await db.listNodesBySpaceId(space.id)
    this.setNodes(nodes)
  }

  async openInNewPanel(nodeId: string) {
    const nodes = this.getNodes()
    const node = nodes.find((n) => n.id === nodeId)!
    const activeNodes = this.getActiveNodes()

    const newActiveNodes = [...activeNodes, node]
    this.setActiveNodes([...newActiveNodes])

    const space = this.store.space.getActiveSpace()
    await db.updateSpace(space.id, {
      activeNodeIds: newActiveNodes.map((node) => node.id),
    })
  }

  async closePanel(index: number) {
    const activeNodes = this.getActiveNodes()
    const newActiveNodes = activeNodes.filter((_, i) => i !== index)
    this.setActiveNodes([...newActiveNodes])

    const space = this.store.space.getActiveSpace()
    await db.updateSpace(space.id, {
      activeNodeIds: newActiveNodes.map((node) => node.id),
    })
  }

  async selectDailyNote(date: Date = new Date()) {
    const dateStr = format(date, 'yyyy-MM-dd')
    const nodes = this.getNodes()
    let dateNode = nodes.find(
      (node) => node.type === NodeType.DAILY && node.props.date === dateStr,
    )
    const space = this.store.space.getActiveSpace()
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
  }

  async createNodeToToday(text: string) {
    const space = this.store.space.getActiveSpace()
    const { todayNode } = await db.addNodeToToday(space.id, text)
    const nodes = await db.listNormalNodes(space.id)

    this.setNodes(nodes)
    this.selectNode(todayNode)
  }

  async createPageNode(input: Partial<INode> = {}) {
    const space = this.store.space.getActiveSpace()
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
  }

  async createDatabase(tagName: string) {
    const nodes = this.getNodes()

    let databaseNode = nodes.find(
      (node) => node.type === NodeType.DATABASE && node.props.name === tagName,
    )

    if (!databaseNode) {
      databaseNode = await db.createDatabase(tagName)
    }

    const newNodes = await db.listNormalNodes(databaseNode.spaceId)
    this.setNodes(newNodes)

    return databaseNode
  }

  async deleteRow(rowId: string) {
    await db.deleteRow(rowId)
  }
}
