import { z } from 'zod'
import { sleep } from '@penx/shared'
import { getToken } from '../github-bot/getToken'
import { createTRPCRouter, publicProcedure } from '../trpc'

const ALL_EXTENSIONS_KEY = 'extensions:all'

export const extensionRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.extension.findMany()
    // const value = await client.get(ALL_EXTENSIONS_KEY)
    // if (value) {
    //   return JSON.parse(value) as Extension[]
    // }
    // const extensions = await ctx.prisma.extension.findMany({
    //   orderBy: { createdAt: 'desc' },
    // })
    // await client.set(ALL_EXTENSIONS_KEY, JSON.stringify(extensions))
    // return extensions
  }),

  upsertExtension: publicProcedure
    .input(
      z.object({
        uniqueId: z.string(),
        manifest: z.string(),
        logo: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ext = await ctx.prisma.extension.findUnique({
        where: { uniqueId: input.uniqueId },
      })

      if (ext) {
        await ctx.prisma.extension.update({
          where: { id: ext.id },
          data: {
            manifest: input.manifest,
            logo: input.logo,
          },
        })
      } else {
        await ctx.prisma.extension.create({
          data: {
            userId: 'default',
            uniqueId: input.uniqueId,
            manifest: input.manifest,
            logo: input.logo,
          },
        })
      }
      return true
    }),

  getGitHubToken: publicProcedure.query(() => {
    return getToken()
  }),
})
