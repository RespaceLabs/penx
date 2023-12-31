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

    const nodes = await db.listNodesBySpaceId(space.id)

    space = await db.getSpace(space.id)

    const activeNodes = space.activeNodeIds.map((id) => {
      return nodes.find((n) => n.id === id)!
    })

    this.setSpaces(spaces)
    this.store.router.toNode()
    this.store.node.setNodes(nodes)

    this.store.node.selectNode(activeNodes[0])
    return space
  }

  async deleteSpace(spaceId: string) {
    await db.deleteSpace(spaceId)
    const spaces = await db.listSpaces()

    if (!spaces.length) {
      this.setSpaces([])
      return
    }

    const space = await db.getActiveSpace()
    const nodes = await db.listNodesBySpaceId(space.id)

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
    this.store.app.setAppLoading(true)

    await db.selectSpace(id)

    const spaces = await db.listSpaces()
    const nodes = await db.listNodesBySpaceId(id)
    const space = await db.getActiveSpace()

    // this.store.space.setSpaces([])
    this.store.node.setNodes([])
    this.store.node.setActiveNodes([])

    let activeNodes = space.activeNodeIds
      .map((id) => {
        return nodes.find((n) => n.id === id)!
      })
      .filter((n) => !!n)

    if (space.encrypted && !nodes.length) {
      this.store.router.routeTo('SET_PASSWORD')
    } else {
      if (!activeNodes.length) {
        const todayNode = await db.getOrCreateTodayNode(space.id)
        const nodes = await db.listNodesBySpaceId(id)

        await db.updateSpace(space.id, {
          activeNodeIds: [todayNode.id],
        })

        const spaces = await db.listSpaces()

        this.setSpaces(spaces)
        this.store.node.setNodes(nodes)
        this.store.node.setActiveNodes([todayNode])
      } else {
        this.setSpaces(spaces)
        this.store.node.setNodes(nodes)
        this.store.node.selectNode(activeNodes[0])
      }
    }

    this.store.app.setAppLoading(false)
    return space
  }

  async updateSpace(id: string, data: Partial<ISpace>) {
    await db.updateSpace(id, data)
    const spaces = await db.listSpaces()
    this.setSpaces(spaces)
  }
}
