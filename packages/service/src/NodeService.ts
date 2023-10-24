import _ from 'lodash'
import { db } from '@penx/local-db'
import { Node, Page } from '@penx/model'
import { store } from '@penx/store'

export class NodeService {
  constructor(private node: Node) {}

  get spaceId() {
    return this.node.spaceId
  }

  async selectNode() {
    // TODO: improve performance
    const nodes = await db.listNormalNodes(this.spaceId)
    const page = new Page(this.node.raw, nodes)
    store.routeTo('NODE')
    store.reloadPage(page)
  }

  async addToFavorites() {
    const space = store.getActiveSpace()

    await db.updateSpace(this.spaceId, {
      favorites: [...space.favorites, this.node.id],
    })

    const spaces = await db.listSpaces()
    store.setSpaces(spaces)
  }

  async removeFromFavorites() {
    const space = store.getActiveSpace()

    const favorites = space.favorites.filter((id) => id !== this.node.id)
    await db.updateSpace(this.spaceId, { favorites })

    const spaces = await db.listSpaces()
    store.setSpaces(spaces)
  }

  isFavorite() {
    const space = store.getActiveSpace()
    return space.favorites.includes(this.node.id)
  }
}
