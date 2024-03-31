import { atom } from 'jotai'
import { db } from '@penx/local-db'
import { INode, ISpace } from '@penx/model-types'
import { SyncServerClient } from '@penx/sync-server-client'
import { StoreType } from '../store-types'

export const spacesAtom = atom<ISpace[]>([])

export const activeSpaceAtom = atom<ISpace>(null as unknown as ISpace)

export class SpaceStore {
  constructor(private store: StoreType) {}

  getSpaces() {
    return this.store.get(spacesAtom)
  }

  setSpaces(spaces: ISpace[]) {
    this.store.set(spacesAtom, spaces)
  }

  getActiveSpace() {
    return this.store.get(activeSpaceAtom)
  }

  setActiveSpace(space: ISpace) {
    this.store.set(activeSpaceAtom, space)
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
    this.store.node.setNodes(nodes)
    this.store.router.toNode()
    // this.store.node.selectNode(activeNodes[0])
    this.store.node.selectDailyNote()
    return space
  }

  async deleteSpace(spaceId: string) {
    await db.deleteSpace(spaceId)
    const spaces = await db.listSpaces()

    if (!spaces.length) {
      this.setSpaces([])
      return
    }

    const space = this.getActiveSpace()
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

    try {
      const spaces = await db.listSpaces()
      let nodes = await db.listNodesBySpaceId(id)

      const newActiveSpace = spaces.find((s) => s.id === id)!

      if (!nodes.length) {
        const mnemonic = this.store.user.getMnemonic()
        // console.log('select space======mnemonic:', mnemonic)
        try {
          const client = new SyncServerClient(newActiveSpace, mnemonic)
          nodes = await client.getAllNodes()

          for (const node of nodes) {
            await db.createNode(node)
          }
        } catch (error) {
          console.log('sync server error', error)
        }
      }

      // this.store.space.setSpaces([])
      this.store.node.setNodes([])
      this.store.node.setActiveNodes([])

      let activeNodes = newActiveSpace.activeNodeIds
        .map((id) => {
          return nodes.find((n) => n.id === id)!
        })
        .filter((n) => !!n)

      if (!activeNodes.length) {
        const todayNode = await db.getOrCreateTodayNode(newActiveSpace.id)
        const nodes = await db.listNodesBySpaceId(id)

        await db.updateSpace(newActiveSpace.id, {
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

      this.setActiveSpace(newActiveSpace)
      this.store.app.setAppLoading(false)
      return newActiveSpace
    } catch (error) {
      // TODO: fallback to old data
      this.store.app.setAppLoading(false)
    }
  }

  async updateSpace(id: string, data: Partial<ISpace>) {
    await db.updateSpace(id, data)
    const spaces = await db.listSpaces()
    this.setSpaces(spaces)
  }
}
