import _ from 'lodash'
import { db, IDoc } from '@penx/local-db'
import { slateToMarkdown } from '@penx/serializer'
import { docAtom, store } from '@penx/store'
import { Catalogue } from './Catalogue'
import { ChangeService } from './ChangeService'

export class DocService {
  constructor(
    public raw: IDoc,
    public catalogue: Catalogue,
  ) {}

  get id() {
    return this.raw.id
  }

  get inited() {
    return !!this.raw
  }

  get spaceId() {
    return this.raw.spaceId
  }

  get title(): string {
    return this.raw?.title || ''
  }

  get content() {
    return JSON.parse(this.raw?.content || '[]')
  }

  get markdownContent() {
    return slateToMarkdown(this.content)
  }

  private debouncedUpdateDoc = _.debounce(
    async (content: any, title: string) => {
      const { raw: doc, catalogue } = this

      const newContent = JSON.stringify(content)

      await db.updateDoc(doc.id, {
        title,
        content: newContent,
      })

      const space = await db.getSpace(doc.spaceId)
      const changeService = new ChangeService(space!)
      await changeService.update(doc.id, this.raw.content, newContent)

      await catalogue.updateNodeName(doc.id, title)

      store.set(docAtom, {
        ...doc,
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
    store.set(docAtom, { ...this.raw, title })
  }

  selectDoc = async () => {
    const doc = await db.selectDoc(this.spaceId, this.id)
    this.updateDocAtom(doc!)
  }

  private updateDocAtom(doc: IDoc) {
    store.set(docAtom, null as any)

    // for rerender editor
    setTimeout(() => {
      store.set(docAtom, doc!)
    }, 0)
  }
}
