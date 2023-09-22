import _ from 'lodash'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

export class SpaceService {
  createSpace = async (name: string) => {
    const space = await db.createSpace(name)
    await this.loadSpaces()
    return space!
  }

  selectSpace = async (id: string) => {
    await db.selectSpace(id)
    await this.loadSpaces()
  }

  loadSpaces = async () => {
    const spaces = await db.space.toArray()
    store.setSpaces(spaces)
  }
}
