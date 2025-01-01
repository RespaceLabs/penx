import { editorDefaultValue, ELEMENT_P } from '@/lib/constants'
import { uniqueId } from '@/lib/unique-id'
import { desc, eq, or } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db'
import { Block, blocks, databases, Page, pages } from '../db/schema'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const blockRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    return await db.query.pages.findMany({
      orderBy: [desc(databases.updatedAt)],
    })
  }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const block = await db.query.blocks.findFirst({
      where: eq(blocks.id, input),
    })

    return block!
  }),
})
