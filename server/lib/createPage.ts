import { eq } from 'drizzle-orm'
import { editorDefaultValue, ELEMENT_P } from '@/lib/constants'
import { db } from '../db'
import { blocks, pages } from '../db/schema'

interface Input {
  userId: string
  title: string
  isJournal?: boolean
  date?: string
}

export async function createPage(input: Input) {
  const [newPage] = await db
    .insert(pages)
    .values({
      props: {},
      children: [],
      ...input,
    })
    .returning()

  const [newBlock] = await db
    .insert(blocks)
    .values({
      pageId: newPage.id,
      parentId: newPage.id,
      content: editorDefaultValue[0],
      type: ELEMENT_P,
      props: {},
      children: [],
      ...input,
    })
    .returning()

  await db
    .update(pages)
    .set({
      children: [newBlock.id],
    })
    .where(eq(pages.id, newPage.id))

  newPage.children = [newBlock.id]
  return newPage
}
