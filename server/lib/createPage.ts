import { eq } from 'drizzle-orm'
import { editorDefaultValue, ELEMENT_P } from '@/lib/constants'
import { db } from '../db'
import { posts } from '../db/schema'

interface Input {
  userId: string
  title: string
  isJournal?: boolean
  date?: string
}

export async function createPage(input: Input) {
  const [newPage] = await db
    .insert(posts)
    .values({
      content: JSON.stringify(editorDefaultValue),
      isPage: true,
      ...input,
    })
    .returning()

  return newPage
}
