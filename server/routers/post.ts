import { IPFS_ADD_URL, PostStatus } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { GateType, PostType, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { Node as SlateNode } from 'slate'
import { z } from 'zod'
import { syncToGoogleDrive } from '../lib/syncToGoogleDrive'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const postRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    const posts = await prisma.post.findMany({
      include: {
        postTags: { include: { tag: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return posts
  }),

  publishedPosts: publicProcedure.query(async ({ ctx, input }) => {
    const posts = await prisma.post.findMany({
      where: { postStatus: PostStatus.PUBLISHED },
    })

    return posts
  }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const post = await prisma.post.findUniqueOrThrow({
      include: {
        postTags: { include: { tag: true } },
      },
      where: { id: input },
    })

    syncToGoogleDrive(ctx.token.uid, post as any)
    // console.log('post-------xxxxxxxxxx:', post?.postTags)
    return post
  }),

  create: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(PostType),
        title: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newPost = await prisma.post.create({
        data: {
          userId: ctx.token.uid,
          type: input.type,
        },
      })

      return prisma.post.findUniqueOrThrow({
        where: { id: newPost.id },
      })
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

      const post = await prisma.post.update({
        where: { id },
        data: {
          ...data,
          content: content || '',
        },
      })

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
      const post = await prisma.post.update({
        where: { id },
        data: { image },
      })

      return post
    }),

  publish: protectedProcedure
    .input(
      z.object({
        nodeId: z.string(),
        creationId: z.number().optional(),
        type: z.nativeEnum(PostType),
        gateType: z.nativeEnum(GateType),
        collectable: z.boolean(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      const { nodeId, gateType, collectable, creationId } = input

      const node = await prisma.node.findUniqueOrThrow({
        where: { id: nodeId },
      })

      console.log('=====>>>node:', node)
      const p = await prisma.post.findFirst({
        where: { nodeId },
      })
      const [title, ...nodes] = JSON.parse(input.content)

      if (!p) {
        await prisma.post.create({
          data: {
            userId,
            title: SlateNode.string(title),
            type: input.type,
            nodeId: input.nodeId,
            postStatus: PostStatus.PUBLISHED,
            gateType: input.gateType,
            collectable: input.collectable,
            content: JSON.stringify(nodes),
          },
        })
      }

      return

      const post = await prisma.post.findUnique({
        include: { postTags: { include: { tag: true } } },
        where: { id: nodeId },
      })

      const res = await fetch(IPFS_ADD_URL, {
        method: 'POST',
        body: JSON.stringify({
          ...post,
          postStatus: PostStatus.PUBLISHED,
          collectable,
          creationId,
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then((d) => d.json())

      await prisma.post.update({
        where: { id: nodeId },
        data: {
          postStatus: PostStatus.PUBLISHED,
          collectable,
          creationId,
          cid: res.cid,
          publishedAt: new Date(),
          gateType,
        },
      })

      revalidatePath('/', 'layout')
      // revalidatePath('/(blog)/(home)', 'page')
      revalidatePath('/(blog)/posts', 'page')
      revalidatePath('/(blog)/posts/[...slug]', 'page')
      revalidatePath('/(blog)/posts/page/[page]', 'page')

      // sync google
      syncToGoogleDrive(ctx.token.uid, {
        ...post,
        postStatus: PostStatus.PUBLISHED,
        collectable,
        creationId,
        cid: res.cid,
        gateType,
      } as any)

      return post
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.delete({
        where: { id: input },
      })

      return post
    }),
})
