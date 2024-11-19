import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const commentRouter = router({
  // Fetch comments by postId
  listByPostId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: postId }) => {
      const comments = await prisma.comment.findMany({
        where: { postId, parentId: null }, // Only top-level comments (parentId === null) need to be queried
        include: {
          user: true, // Assuming you want to include user details in comments
        },
        orderBy: { createdAt: 'asc' },
      })
      return comments
    }),

  // Create a new comment
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        userId: z.string(),
        parentId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newComment = await prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          userId: ctx.token.uid,
          parentId: input.parentId || null,
        },
      })

      if (input.parentId) {
        await prisma.comment.update({
          where: { id: input.parentId },
          data: {
            replyCount: { increment: 1 },
          },
        })
      } else {
        const updatedPost = await prisma.post.update({
          where: { id: input.postId },
          data: {
            commentCount: { increment: 1 },
          },
        })

        revalidatePath('/(blog)/(home)', 'page')
        revalidatePath('/(blog)/posts', 'page')
        revalidatePath(`/posts/${updatedPost.slug}`)
      }

      return newComment
    }),

  listRepliesByCommentId: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: commentId }) => {
      const replies = await prisma.comment.findMany({
        where: { parentId: commentId },
        include: {
          user: true,
          parent: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      return replies;
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
      const updatedComment = await prisma.comment.update({
        where: { id: input.commentId },
        data: {
          content: input.content,
          updatedAt: new Date(),
        },
      })
      return updatedComment
    }),

  // Delete a comment
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: commentId }) => {
      const deletedComment = await prisma.comment.delete({
        where: { id: commentId },
      })
      return deletedComment
    }),
})
