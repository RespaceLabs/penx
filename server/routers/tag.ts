import { and, eq } from 'drizzle-orm'
import { slug } from 'github-slugger'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { redisKeys } from '@/lib/redisKeys'
import { TRPCError } from '@trpc/server'
import { db } from '../db'
import { postTags, tags } from '../db/schema'
import { protectedProcedure, publicProcedure, router } from '../trpc'

function revalidate() {
  revalidatePath('/tags')
  revalidatePath('/(blogs)/tags/[tag]', 'page')
}

export const tagRouter = router({
  list: publicProcedure.query(async () => {
    const tags = await db.query.tags.findMany()
    return tags
  }),

  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tagName = slug(input.name)
      let tag = await db.query.tags.findFirst({
        where: eq(tags.name, tagName),
      })

      if (!tag) {
        const newTags = await db
          .insert(tags)
          .values({
            name: tagName,
            userId: ctx.token.uid,
          })
          .returning()

        tag = newTags[0]
      }

      const postTag = await db.query.postTags.findFirst({
        where: and(
          eq(postTags.postId, input.postId),
          eq(postTags.tagId, tag.id),
        ),
      })

      if (postTag) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Tag already exists',
        })
      }

      const [newPostTag] = await db
        .insert(postTags)
        .values({
          postId: input.postId,
          tagId: tag.id,
        })
        .returning()

      const res = await db.query.postTags.findFirst({
        where: eq(postTags.id, newPostTag.id),
        with: { tag: true },
      })

      revalidate()
      return res!
    }),

  add: protectedProcedure
    .input(
      z.object({
        tagId: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const postTag = await db
        .insert(postTags)
        .values({
          ...input,
        })
        .returning()

      revalidate()

      const res = await db.query.postTags.findFirst({
        with: { tag: true },
        where: eq(postTags.id, postTag[0].id),
      })
      return res!
    }),

  deletePostTag: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const post = await db.delete(postTags).where(eq(postTags.id, input))

      revalidate()
      return post
    }),
})
