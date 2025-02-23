import { desc, eq, or } from 'drizzle-orm'
import { slug } from 'github-slugger'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { PageStatus } from '@/lib/types'
import { uniqueId } from '@/lib/unique-id'
import { TRPCError } from '@trpc/server'
import { db } from '../db'
import { databases, posts } from '../db/schema'
import { createPage } from '../lib/createPage'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const pageRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    return await db.query.posts.findMany({
      orderBy: [desc(databases.updatedAt)],
      where: eq(posts.isPage, true),
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
        const page = await db.query.posts.findFirst({
          where: eq(posts.id, pageId),
          with: {
            postTags: { with: { tag: true } },
            authors: {
              with: {
                user: true,
              },
            },
          },
        })
        return page!
      } else {
        const page = await db.query.posts.findFirst({
          where: eq(posts.date, date),
          with: {
            postTags: { with: { tag: true } },
            authors: {
              with: {
                user: true,
              },
            },
          },
        })

        if (page) return page

        const { id } = await createPage({
          userId: ctx.token.uid,
          date,
          title: '',
          isJournal: true,
        })

        const newPage = await db.query.posts.findFirst({
          where: eq(posts.id, id),
          with: {
            postTags: { with: { tag: true } },
            authors: {
              with: {
                user: true,
              },
            },
          },
        })
        return newPage!
      }
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
})
