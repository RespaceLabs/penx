import _ from 'lodash'
import { db } from '@penx/local-db'
import { docAtom, spacesAtom, store } from '@penx/store'

export class SpaceService {
  createSpace = async (name: string) => {
    const space = await db.createSpace(name)
    await this.loadSpaces()
    return space!
  }

  selectSpace = async (id: string) => {
    await db.selectSpace(id)

    await this.loadSpaces()
    const docs = await db.listDocsBySpaceId(id)

    if (docs.length) {
      store.set(docAtom, null as any)

      // for rerender editor
      setTimeout(() => {
        store.set(docAtom, docs[0])
      }, 0)
    }
  }

  loadSpaces = async () => {
    const spaces = await db.listSpaces()
    store.set(spacesAtom, spaces)
  }
}
