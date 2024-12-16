import { and, eq, isNull, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '../db'
import { comments, posts } from '../db/schema'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const commentRouter = router({
  // Fetch comments by postId
  listByPostId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: postId }) => {
      const comments = await db.query.comments.findMany({
        where: (comments, { eq }) => and(eq(comments.postId, postId)),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              displayName: true,
              email: true,
              image: true,
            },
          },
          parent: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  displayName: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: (comments, { asc }) => [asc(comments.createdAt)],
      })
      return comments
    }),

  // Create a new comment
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        parentId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newComment = await db
        .insert(comments)
        .values({
          content: input.content,
          postId: input.postId,
          userId: ctx.token.uid,
          parentId: input.parentId || null,
        })
        .returning()

      if (input.parentId) {
        await db
          .update(comments)
          .set({
            replyCount: sql`replyCount + 1`,
          })
          .where(eq(comments.id, input.parentId))
      }

      const updatedPost = await db
        .update(posts)
        .set({ commentCount: sql`commentCount + 1` })
        .where(eq(posts.id, input.postId))
        .returning()

      revalidatePath('/(blog)/(home)', 'page')
      revalidatePath('/(blog)/posts', 'page')
      revalidatePath(`/posts/${updatedPost[0]?.slug}`)

      return newComment
    }),

  listRepliesByCommentId: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: commentId }) => {
      const replies = await db.query.comments.findMany({
        where: eq(comments.parentId, commentId),
        with: {
          user: true,
          parent: {
            with: {
              user: true,
            },
          },
        },
        orderBy: (comments, { asc }) => [asc(comments.createdAt)],
      })

      return replies
    }),

  // Update an existing comment
  update: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedComment = await db
        .update(comments)
        .set({
          content: input.content,
          updatedAt: new Date(),
        })
        .where(eq(comments.id, input.commentId))
      return updatedComment
    }),

  // Delete a comment
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: commentId }) => {
      const deletedComment = await db
        .delete(comments)
        .where(eq(comments.id, commentId))
      return deletedComment
    }),
})
