import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db'
import { accessTokens } from '../db/schema'
import { protectedProcedure, router } from '../trpc'

export const accessTokenRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    return db.query.accessTokens.findMany({
      orderBy: (accessTokens, { desc }) => [desc(accessTokens.createdAt)],
    })
  }),

  create: protectedProcedure
    .input(
      z.object({
        token: z.string(),
        alias: z.string(),
        expiredAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const record = await db
        .insert(accessTokens)
        .values({
          token: input.token,
          alias: input.alias,
          userId: ctx.token.uid,
          expiresAt: input.expiredAt,
        })
        .returning()
      return record
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.delete(accessTokens).where(eq(accessTokens.id, input.id))
      return { success: true }
    }),
})
