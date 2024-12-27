import { desc, eq, or } from 'drizzle-orm'
import { z } from 'zod'
import { editorDefaultValue, ELEMENT_P } from '@/lib/constants'
import { db } from '../db'
import { blocks, databases, pages } from '../db/schema'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const pageRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    return await db.query.pages.findMany({
      orderBy: [desc(databases.createdAt)],
    })
  }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const page = await db.query.pages.findFirst({
      with: {
        blocks: true,
      },
      where: eq(pages.id, input),
    })

    return page!
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newPage] = await db
        .insert(pages)
        .values({
          userId: ctx.token.uid,
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
    }),
})
