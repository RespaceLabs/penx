import { atom } from 'jotai'
import { db } from '@penx/local-db'
import { ISpace } from '@penx/model-types'
import { StoreType } from './store-types'

export const spacesAtom = atom<ISpace[]>([])

export class SpaceStore {
  constructor(private store: StoreType) {}

  getSpaces() {
    return this.store.get(spacesAtom)
  }

  setSpaces(spaces: ISpace[]) {
    this.store.set(spacesAtom, spaces)
  }

  getActiveSpace() {
    const spaces = this.getSpaces()
    return spaces.find((space) => space.isActive)!
  }

  async createSpace(input: Partial<ISpace>) {
    let space = await db.createSpace(input)
    const spaces = await db.listSpaces()

    const nodes = await db.listNormalNodes(space.id)

    space = await db.getSpace(space.id)
    const activeNodes = space.activeNodeIds.map((id) => {
      return nodes.find((n) => n.id === id)!
    })

    this.store.router.toNode()
    this.store.node.setNodes(nodes)
    this.setSpaces(spaces)
    this.store.node.selectNode(activeNodes[0])
    this.store.node.setActiveNodes(activeNodes)
    return space
  }

  async deleteSpace(spaceId: string) {
    await db.deleteSpace(spaceId)
    const spaces = await db.listSpaces()
    const space = await db.getActiveSpace()
    const nodes = await db.listNormalNodes(space.id)
    const activeNodes = space.activeNodeIds.map((id) => {
      return nodes.find((n) => n.id === id)!
    })

    this.store.router.toNode()
    this.store.node.setNodes(nodes)
    this.store.node.selectNode(activeNodes[0])
    this.store.node.setActiveNodes(activeNodes)
    this.setSpaces(spaces)
  }

  async selectSpace(id: string) {
    await db.selectSpace(id)
    const spaces = await db.listSpaces()
    const nodes = await db.listNormalNodes(id)
    const space = await db.getActiveSpace()

    const activeNodes = space.activeNodeIds.map((id) => {
      return nodes.find((n) => n.id === id)!
    })

    this.setSpaces(spaces)
    this.store.node.setNodes(nodes)

    if (space.isCloud && space.encrypted && !nodes.length) {
      this.store.router.routeTo('SET_PASSWORD')
    } else {
      this.store.node.selectNode(activeNodes[0])
    }
    return space
  }

  async updateSpace(id: string, data: Partial<ISpace>) {
    await db.updateSpace(id, data)
    const spaces = await db.listSpaces()
    this.setSpaces(spaces)
  }
}
