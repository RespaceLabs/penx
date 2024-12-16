import { IPFS_ADD_URL, PostStatus } from '@/lib/constants'
import { GateType, PostType } from '@/lib/types'
import { desc, eq, or } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { Node as SlateNode } from 'slate'
import { z } from 'zod'
import { db } from '../db'
import { posts } from '../db/schema'
import { syncToGoogleDrive } from '../lib/syncToGoogleDrive'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const postRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    return await db.query.posts.findMany({
      with: {
        postTags: { with: { tag: true } },
      },
      orderBy: [desc(posts.createdAt)],
    })
  }),

  publishedPosts: publicProcedure.query(async ({ ctx, input }) => {
    return await db.query.posts.findMany({
      where: eq(posts.postStatus, PostStatus.PUBLISHED),
    })
  }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const post = await db.query.posts.findFirst({
      with: {
        postTags: { with: { tag: true } },
      },
      where: eq(posts.id, input),
    })

    syncToGoogleDrive(ctx.token.uid, post as any)
    // console.log('post-------xxxxxxxxxx:', post?.postTags)
    return post!
  }),

  bySlug: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return db.query.posts.findFirst({
      where: eq(posts.slug, input),
    })
  }),

  create: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(PostType),
        title: z.string().optional(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await db
        .insert(posts)
        .values({
          userId: ctx.token.uid,
          ...input,
        })
        .returning()
      return post[0]!
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, content, ...data } = input

      const post = await db
        .update(posts)
        .set({
          ...data,
          content: content || '',
        })
        .where(eq(posts.id, id))
        .returning()

      return post
    }),

  updateCover: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, image } = input
      const post = await db
        .update(posts)
        .set({ image })
        .where(eq(posts.id, id))
        .returning()

      return post
    }),

  publish: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        creationId: z.number().nullable().optional(),
        gateType: z.nativeEnum(GateType),
        collectible: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log('========>input:', input, ctx.token)
      const userId = ctx.token.uid
      const { gateType, collectible, creationId } = input

      await db
        .update(posts)
        .set({
          postStatus: PostStatus.PUBLISHED,
          gateType: input.gateType,
          collectible: input.collectible,
        })
        .where(eq(posts.id, input.postId))

      const newPost = await db.query.posts.findFirst({
        with: { postTags: { with: { tag: true } } },
        where: eq(posts.id, input.postId),
      })

      const res: any = await fetch(IPFS_ADD_URL, {
        method: 'POST',
        body: JSON.stringify({
          ...newPost,
          postStatus: PostStatus.PUBLISHED,
          collectible,
          creationId,
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then((d) => d.json())

      await db
        .update(posts)
        .set({
          postStatus: PostStatus.PUBLISHED,
          collectible,
          creationId,
          cid: res.cid,
          publishedAt: new Date(),
          gateType,
        })
        .where(eq(posts.id, input.postId))

      try {
        revalidatePath('/', 'layout')
        // revalidatePath('/(blog)/(home)', 'page')
        revalidatePath('/(blog)/posts', 'page')
        revalidatePath('/(blog)/posts/[...slug]', 'page')
        revalidatePath('/(blog)/posts/page/[page]', 'page')
      } catch (error) {}

      // sync google
      // syncToGoogleDrive(ctx.token.uid, {
      //   ...newPost,
      //   postStatus: PostStatus.PUBLISHED,
      //   collectible,
      //   creationId,
      //   cid: res.cid,
      //   gateType,
      // } as any)

      return newPost
    }),

  archive: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await db
        .update(posts)
        .set({
          postStatus: PostStatus.ARCHIVED,
        })
        .where(eq(posts.id, input))

      // revalidateTag(`posts-${post.slug}`)
      // revalidatePath(`/posts/${post.slug}`)

      return post
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await db.delete(posts).where(eq(posts.id, input))

      return post
    }),
})
