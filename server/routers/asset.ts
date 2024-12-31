import { getRequestContext } from '@cloudflare/next-on-pages'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db'
import { assets, posts } from '../db/schema'
import { protectedProcedure, router } from '../trpc'

export const assetRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        pageNum: z.number().optional().default(1),
        pageSize: z.number().optional().default(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { pageNum, pageSize } = input
      const offset = (pageNum - 1) * pageSize

      const list = await db.query.assets.findMany({
        where: eq(assets.isTrashed, false),
        with: {
          assetLabels: { with: { label: true } },
        },
        orderBy: [desc(posts.createdAt)],
        limit: pageSize,
        offset: offset,
      })
      return list
    }),

  trashedAssets: protectedProcedure
    .input(
      z.object({
        pageNum: z.number().optional().default(1),
        pageSize: z.number().optional().default(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { pageNum, pageSize } = input
      const offset = (pageNum - 1) * pageSize
      return db.query.assets.findMany({
        where: eq(assets.isTrashed, true),
        with: {
          assetLabels: { with: { label: true } },
        },
        orderBy: [desc(posts.createdAt)],
        limit: pageSize,
        offset: offset,
      })
    }),

  trash: protectedProcedure
    .input(
      z.object({
        assetId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(assets)
        .set({ isTrashed: true })
        .where(eq(assets.id, input.assetId))
      return true
    }),

  delete: protectedProcedure
    .input(
      z.object({
        assetId: z.string(),
        key: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { env } = getRequestContext()
      await env.BUCKET.delete(input.key)
      await db.delete(assets).where(eq(assets.id, input.assetId))
      return true
    }),

  updatePublicStatus: protectedProcedure
    .input(
      z.object({
        assetId: z.string(),
        isPublic: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(assets)
        .set({ isPublic: input.isPublic })
        .where(eq(assets.id, input.assetId))
      return true
    }),
})
