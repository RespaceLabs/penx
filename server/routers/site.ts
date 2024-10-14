import { prisma } from '@/lib/prisma'
import { redisKeys } from '@/lib/redisKeys'
import Redis from 'ioredis'
import { z } from 'zod'
import { getSite } from '../lib/getSite'
import { protectedProcedure, publicProcedure, router } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

export const siteRouter = router({
  getSite: publicProcedure.query(async () => {
    return getSite()
  }),

  updateSite: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        logo: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        about: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const site = await prisma.site.findFirst({
        where: { id },
      })
      if (!site) {
        const newSite = await prisma.site.create({
          data: {
            ...data,
            socials: {},
            config: {},
            name: data.name || '',
          },
        })
        return newSite
      } else {
        const newSite = await prisma.site.update({
          where: { id },
          data,
        })
        return newSite
      }
    }),
})
