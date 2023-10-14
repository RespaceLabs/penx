import _ from 'lodash'
import { db, IDoc } from '@penx/local-db'
import { slateToMarkdown } from '@penx/serializer'
import { docAtom, store } from '@penx/store'
import { Doc } from '../entity'
import { ChangeService } from './ChangeService'

export class DocService {
  constructor(public doc: Doc) {}

  get content() {
    return JSON.parse(this.doc?.content || '[]')
  }

  get markdownContent() {
    return slateToMarkdown(this.content)
  }

  private debouncedUpdateDoc = _.debounce(
    async (content: any, title: string) => {
      const { doc: doc } = this

      const newContent = JSON.stringify(content)

      await db.updateDoc(doc.id, {
        title,
        content: newContent,
      })

      const space = await db.getSpace(doc.spaceId)
      const changeService = new ChangeService(space!)
      await changeService.update(doc.id, this.doc.content, newContent)

      store.set(docAtom, {
        ...this.doc.raw,
        title,
        content: newContent,
      })
    },
    50,
  )

  updateDoc = (content: any, title: string) => {
    this.debouncedUpdateDoc(content, title)
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
}
