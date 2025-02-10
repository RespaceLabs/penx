import { desc, eq, or } from 'drizzle-orm'
import { slug } from 'github-slugger'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { PageStatus } from '@/lib/types'
import { uniqueId } from '@/lib/unique-id'
import { TRPCError } from '@trpc/server'
import { db } from '../db'
import { blocks, databases, Page, pages } from '../db/schema'
import { createPage } from '../lib/createPage'
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
      return createPage({
        userId: ctx.token.uid,
        title: '',
      })
    }),

  getPage: protectedProcedure
    .input(
      z.object({
        pageId: z.string().optional(),
        date: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { pageId = '', date = '' } = input
      if (!pageId && !date) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either pageId or date is required.',
        })
      }

      if (pageId) {
        const page = await db.query.pages.findFirst({
          with: { blocks: true },
          where: eq(pages.id, pageId),
        })
        return page!
      } else {
        const page = await db.query.pages.findFirst({
          with: { blocks: true },
          where: eq(pages.date, date),
        })

        if (page) return page

        const { id } = await createPage({
          userId: ctx.token.uid,
          date,
          title: '',
          isJournal: true,
        })

        const newPage = await db.query.pages.findFirst({
          with: { blocks: true },
          where: eq(pages.id, id),
        })
        return newPage!
      }
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
        const addedPromises = added.map(({ id, ...content }) => {
          return db.insert(blocks).values({
            id,
            pageId,
            parentId: pageId,
            type: content?.type,
            content: content,
            children: [],
            props: {},
          })
        })

        await Promise.all(addedPromises)
      }

      const updatedPromises = updated.map(({ id, ...content }) => {
        return db.update(blocks).set({ content }).where(eq(blocks.id, id))
      })

      await Promise.all(updatedPromises)
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

  publish: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { pageId } = input

      const page = await db.query.pages.findFirst({
        where: eq(pages.id, input.pageId),
      })

      await db
        .update(pages)
        .set({
          status: PageStatus.PUBLISHED,
          publishedAt: new Date(),
          slug: slug(page!.title || page!.id),
        })
        .where(eq(pages.id, input.pageId))

      try {
        // revalidatePath('/(blog)/(home)', 'page')
        revalidatePath('/(blog)/p/[...slug]', 'page')
      } catch (error) {}

      return page
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
