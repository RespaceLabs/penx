import DiffMatchPatch from 'diff-match-patch'
import { ChangeType, db, ISpace } from '@penx/local-db'
import { slateToMarkdown } from '@penx/serializer'

export class ChangeService {
  constructor(public space: ISpace) {}

  private get spaceId(): string {
    return this.space.id
  }

  private get changes(): ISpace['changes'] {
    return this.space.changes || {}
  }

  isAdded(id: string): boolean {
    return this.changes[id]?.type === ChangeType.ADD
  }

  isUpdated(id: string): boolean {
    return this.changes[id]?.type === ChangeType.UPDATE
  }

  private isDeleted(id: string): boolean {
    return this.changes[id]?.type === ChangeType.DELETE
  }

  async add(id: string) {
    const newChanges: ISpace['changes'] = {
      ...this.changes,
      [id]: { type: ChangeType.ADD },
    }

    await db.updateSpace(this.spaceId, {
      changes: newChanges,
    })

    this.space.changes = newChanges
  }

  async update(id: string, oldContent: string, newContent: string) {
    if (this.isAdded(id)) {
      const newChanges: ISpace['changes'] = {
        ...this.changes,
        [id]: {
          type: ChangeType.ADD,
          newContent: newContent,
        },
      }

      await db.updateSpace(this.spaceId, {
        changes: newChanges,
      })

      this.space.changes = newChanges
      return
    }

    const currentChange = this.changes[id]

    let item: ISpace['changes'][0] = {
      type: ChangeType.UPDATE,
      newContent: newContent,

      // use first time old content
      oldContent: currentChange ? currentChange.oldContent : oldContent,
    }

    const newChanges: ISpace['changes'] = {
      ...this.changes,
      [id]: item,
    }

    await db.updateSpace(this.spaceId, {
      changes: newChanges,
    })

    this.space.changes = newChanges
  }

  async deleteMany(ids: string[]) {
    const newChanges = ids.reduce<ISpace['changes']>(
      (acc, id) => {
        if (this.isAdded(id)) {
          delete this.changes[id]
          return acc
        } else {
          return { ...acc, [id]: { type: ChangeType.DELETE } }
        }
      },
      this.space.changes as ISpace['changes'],
    )

    await db.updateSpace(this.spaceId, {
      changes: newChanges,
    })

    this.space.changes = newChanges
  }

  isCanPush(triggerLength = 20) {
    let len = 0
    const dmp = new DiffMatchPatch()

    for (const [id, change] of Object.entries(this.changes)) {
      if (this.isDeleted(id)) return true // sync when deleted
      if (this.isAdded(id)) {
        const newMd = slateToMarkdown(JSON.parse(change.newContent || '[]'))
        len += newMd.length
      }

      if (this.isUpdated(id)) {
        const { oldContent = '[]', newContent = '[]' } = change
        const oldMd = slateToMarkdown(JSON.parse(oldContent))
        const newMd = slateToMarkdown(JSON.parse(newContent))

        const diff = dmp.diff_main(oldMd, newMd)

        for (const [type, text = ''] of diff) {
          if (type === DiffMatchPatch.DIFF_EQUAL) continue
          len += text.length
        }
      }
    }

    return len > triggerLength
  }
}
