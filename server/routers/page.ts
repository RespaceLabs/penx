import { editorDefaultValue, ELEMENT_P } from '@/lib/constants'
import { uniqueId } from '@/lib/unique-id'
import { desc, eq, or } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db'
import { Block, blocks, databases, Page, pages } from '../db/schema'
import { protectedProcedure, publicProcedure, router } from '../trpc'

interface SlateElement {
  id: string
  [key: string]: any
}

export const pageRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    return await db.query.pages.findMany({
      orderBy: [desc(databases.updatedAt)],
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
        title: z.string().optional(),
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

  update: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
        title: z.string().optional(),
        elements: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let { pageId, elements, ...data } = input
      let slateElements = JSON.parse(elements || '[]') as SlateElement[]

      // console.log('======>>>>elements:', slateElements)

      slateElements = slateElements.map((e) => ({
        ...e,
        id: e.id || uniqueId(),
      }))

      const children = slateElements.map((el) => el.id)
      const [page] = await db
        .update(pages)
        .set({
          ...data,
          children,
        })
        .where(eq(pages.id, pageId))
        .returning()

      const pageBlocks = await db.query.blocks.findMany({
        where: eq(blocks.pageId, pageId),
      })

      const blockIdsSet = new Set(pageBlocks.map((b) => b.id))

      const updated: SlateElement[] = []
      const added: SlateElement[] = []

      // console.log('=====updated:', updated, 'added:', added)

      for (const e of slateElements) {
        if (blockIdsSet.has(e.id)) {
          updated.push(e)
        } else {
          added.push(e)
        }
      }

      if (added.length) {
        await db.insert(blocks).values(
          added.map(
            ({ id, ...content }) =>
              ({
                id,
                pageId,
                parentId: pageId,
                type: content?.type,
                content: content,
                children: [],
                props: {},
              }) as Block,
          ),
        )
      }

      const promises = updated.map(({ id, ...content }) => {
        return db.update(blocks).set({ content }).where(eq(blocks.id, id))
      })

      await Promise.all(promises)
      await cleanDeletedBlocks(page)

      return page
    }),

  delete: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.delete(blocks).where(eq(blocks.pageId, input.pageId))
      await db.delete(pages).where(eq(pages.id, input.pageId))
      return true
    }),
})

async function cleanDeletedBlocks(page: Page) {
  const pageBlocks = await db.query.blocks.findMany({
    where: eq(blocks.pageId, page.id),
  })

  const promises: any[] = []

  for (const block of pageBlocks) {
    const blockIds = page.children as string[]
    if (!blockIds.includes(block.id)) {
      promises.push(db.delete(blocks).where(eq(blocks.id, block.id)))
    }
  }
  if (promises.length) await Promise.all(promises)
}
