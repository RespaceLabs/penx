import _ from 'lodash'
import { db, IDoc } from '@penx/local-db'
import { store } from '@penx/store'
import { Catalogue } from './Catalogue'
import { ChangeService } from './ChangeService'

export class DocService {
  constructor(
    public raw: IDoc,
    public catalogue: Catalogue,
  ) {}

  get inited() {
    return !!this.raw
  }

  get spaceId() {
    return this.raw.spaceId
  }

  get title(): string {
    return this.raw.title
  }

  get content() {
    return JSON.parse(this.raw?.content || '[]')
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
    },
    50,
  )

  updateDoc = (content: any, title: string) => {
    this.debouncedUpdateDoc(content, title)
  }

  setTitle = async (title: string) => {
    store.setDoc({ ...this.raw, title })

    await db.updateDoc(this.spaceId, {
      title,
    })
  }
}
