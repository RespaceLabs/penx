import Redis from 'ioredis'
import { z } from 'zod'
import { Extension } from '@penx/db'
import { createTRPCRouter, publicProcedure } from '../trpc'

const client = new Redis(
  'redis://default:72dc8b56f9874af59230b1a08ab5bbb1@able-kangaroo-39064.upstash.io:39064',
)
const ALL_EXTENSIONS_KEY = 'extensions:all'

export const extensionRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const value = await client.get(ALL_EXTENSIONS_KEY)
    if (value) {
      return JSON.parse(value) as Extension[]
    }

    const extensions = await ctx.prisma.extension.findMany({
      orderBy: { createdAt: 'desc' },
    })

    await client.set(ALL_EXTENSIONS_KEY, JSON.stringify(extensions))
    return extensions
  }),

  publishExtension: publicProcedure
    .input(
      z.object({
        uniqueId: z.string(),
        name: z.string(),
        version: z.string(),
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log('input.............:', input)

      await ctx.prisma.extension.create({ data: input })

      const extensions = await ctx.prisma.extension.findMany({
        orderBy: { createdAt: 'desc' },
      })
      await client.set(ALL_EXTENSIONS_KEY, JSON.stringify(extensions))
      return true
    }),
})
