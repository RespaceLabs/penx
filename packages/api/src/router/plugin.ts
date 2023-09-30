import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const pluginRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      // return ctx.prisma.plugin.findMany({
      //   where: { spaceId: input.id },
      //   orderBy: { createdAt: 'asc' },
      // })
      return ctx.prisma.plugin.findMany()
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        author: z.string(),
        description: z.string().optional(),
        repo: z.string().optional(),
        version: z.string(),
        downloads: z.number().optional(),
        updated: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.plugin.create({
        data: {
          name: input.name,
          author: input.author,
          description: input.description,
          repo: input.repo,
          version: input.version,
          downloads: input.downloads,
          updated: input.updated,
        },
      })
    }),
})
