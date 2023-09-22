import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createSpace, CreateUserInput } from '../service/createSpace'
import { getAuthApp } from '../service/getAuthApp'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const spaceRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.space.findMany({ orderBy: { createdAt: 'desc' } })
  }),

  mySpaces: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.space.findMany({
      where: { userId: ctx.token.uid },
      orderBy: { createdAt: 'desc' },
    })
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.space.findUnique({
        where: {
          id: input.id,
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      })
    }),

  getCatalogue: publicProcedure
    .input(z.object({ spaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.space.findFirst({
        where: { id: input.spaceId },
        select: { catalogue: true },
      })
      if (!result?.catalogue) return '[]'
      return result.catalogue
    }),

  create: publicProcedure.input(CreateUserInput).mutation(({ ctx, input }) => {
    return createSpace(input)
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        subdomain: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        isPrivate: z.boolean().optional(),
        catalogue: z.string().min(1).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.space.update({ where: { id }, data })
    }),

  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.space.delete({ where: { id: input } })
  }),

  connectRepo: publicProcedure
    .input(
      z.object({
        spaceId: z.string(),
        repoName: z.string(),
        installationId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { installationId, spaceId: id } = input
      return ctx.prisma.space.update({
        where: { id },
        data: { repo: input.repoName, installationId },
      })
    }),

  disconnectRepo: publicProcedure
    .input(z.object({ spaceId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.space.update({
        where: { id: input.spaceId },
        data: { repo: null, installationId: null },
      })
    }),

  updateGithubSettings: publicProcedure
    .input(
      z.object({
        ghToken: z.string(),
        spaceId: z.string(),
        docDir: z.string().min(1),
        branch: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { spaceId: id, ghToken, ...data } = input
      const space = await ctx.prisma.space.findFirstOrThrow({ where: { id } })
      const app = await getAuthApp(space.installationId!)

      const { repo } = space
      const sharedParams = {
        owner: repo!.split('/')[0]!,
        repo: repo!.split('/')[1]!,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }

      try {
        const ref = await app.request(
          'GET /repos/{owner}/{repo}/git/ref/{ref}',
          {
            ...sharedParams,
            ref: `heads/${input.branch}`,
          },
        )

        return ctx.prisma.space.update({ where: { id }, data })
      } catch (error) {
        console.log('error:', error)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Branch "${input.branch}" not found in repo`,
        })
      }
    }),
})
