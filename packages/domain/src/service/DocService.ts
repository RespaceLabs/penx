import _ from 'lodash'
import { db, IDoc } from '@penx/local-db'
import { slateToMarkdown } from '@penx/serializer'
import { docAtom, store } from '@penx/store'
import { Doc } from '../entity'
import { ChangeService } from './ChangeService'

export class DocService {
  constructor(public doc: Doc) {}

  get markdownContent() {
    return slateToMarkdown(this.doc.content)
  }

  // TODO: should debounce
  private debouncedUpdateDoc = async (value: Partial<IDoc>) => {
    const { doc: doc } = this

    await db.updateDoc(doc.id, value)

    const space = await db.getSpace(doc.spaceId)
    const changeService = new ChangeService(space!)
    await changeService.update(doc.id, this.doc.content, value.content!)

    store.set(docAtom, {
      ...this.doc.raw,
      ...value,
    })

    if (value.title !== this.doc.title) {
      const docs = await db.listDocsBySpaceId(doc.spaceId)
      store.setDocs(docs)
    }
  }

  updateDoc = (doc: Partial<IDoc>) => {
    this.debouncedUpdateDoc(doc)
  }

  setTitleState = async (title: string) => {
    store.set(docAtom, { ...this.doc.raw, title })
  }

  selectDoc = async () => {
    const doc = await db.selectDoc(this.doc.spaceId, this.doc.id)

    this.updateDocAtom(doc!)
    const docs = await db.listDocsBySpaceId(this.doc.spaceId)
    store.setDocs(docs)
  }

  private updateDocAtom(doc: IDoc) {
    store.routeTo('DOC')
    store.set(docAtom, null as any)

    // for rerender editor
    setTimeout(() => {
      store.set(docAtom, doc!)
    }, 0)
  }

  async deleteDoc() {
    await db.deleteDoc(this.doc.id)
    const docs = await db.listDocsBySpaceId(this.doc.spaceId)
    store.setDocs(docs)
  }

  async addToFavorites() {
    const space = store.getActiveSpace()

    await db.updateSpace(this.doc.spaceId, {
      favorites: [...space.favorites, this.doc.id],
    })

    const spaces = await db.listSpaces()
    store.setSpaces(spaces)
  }

  async removeFromFavorites() {
    const space = store.getActiveSpace()

    const favorites = space.favorites.filter((id) => id !== this.doc.id)
    await db.updateSpace(this.doc.spaceId, { favorites })

    const spaces = await db.listSpaces()
    store.setSpaces(spaces)
  }

  isFavorite() {
    const space = store.getActiveSpace()
    return space.favorites.includes(this.doc.id)
  }
}
