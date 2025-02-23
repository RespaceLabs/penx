import { desc, eq, or } from 'drizzle-orm'
import { slug } from 'github-slugger'
import ky from 'ky'
import { revalidatePath } from 'next/cache'
import { Node as SlateNode } from 'slate'
import { z } from 'zod'
import { editorDefaultValue, IPFS_ADD_URL, PostStatus } from '@/lib/constants'
import { GateType, PostType } from '@/lib/types'
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
      where: eq(posts.status, PostStatus.PUBLISHED),
    })
  }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const post = await db.query.posts.findFirst({
      with: {
        postTags: { with: { tag: true } },
      },
      where: eq(posts.id, input),
    })

    // syncToGoogleDrive(ctx.token.uid, post as any)
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
      const userId = ctx.token.uid
      const { gateType, collectible, creationId } = input

      await db
        .update(posts)
        .set({
          status: PostStatus.PUBLISHED,
          gateType: input.gateType,
          collectible: input.collectible,
        })
        .where(eq(posts.id, input.postId))

      const post = await db.query.posts.findFirst({
        with: { postTags: { with: { tag: true } } },
        where: eq(posts.id, input.postId),
      })

      let cid = ''
      try {
        const res: any = await ky
          .post(IPFS_ADD_URL, {
            json: {
              ...post,
              status: PostStatus.PUBLISHED,
              collectible,
              creationId,
            },
          })
          .json()
        cid = res.cid
      } catch (error) {}

      await db
        .update(posts)
        .set({
          status: PostStatus.PUBLISHED,
          slug: post!.isPage ? slug(post!.title!) : post!.id,
          collectible,
          creationId,
          cid,
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
      //   status: PostStatus.PUBLISHED,
      //   collectible,
      //   creationId,
      //   cid: res.cid,
      //   gateType,
      // } as any)

      return post
    }),

  updatePublishedPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        featured: z.boolean().optional(),
        isPopular: z.boolean().optional(),
        publishedAt: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, publishedAt, ...data } = input
      await db
        .update(posts)
        .set({
          ...data,
          ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
        })
        .where(eq(posts.id, input.postId))

      try {
        revalidatePath('/', 'layout')
        // revalidatePath('/(blog)/(home)', 'page')
        revalidatePath('/(blog)/posts', 'page')
        revalidatePath('/(blog)/posts/[...slug]', 'page')
        revalidatePath('/(blog)/posts/page/[page]', 'page')
      } catch (error) {}

      return true
    }),

  archive: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await db
        .update(posts)
        .set({
          status: PostStatus.ARCHIVED,
        })
        .where(eq(posts.id, input))

      // revalidateTag(`post-${post.slug}`)
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
