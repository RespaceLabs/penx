import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getSite } from '../lib/getSite'
import { protectedProcedure, publicProcedure, router } from '../trpc'

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
        socials: z.object({
          farcaster: z.string().optional(),
          x: z.string().optional(),
          mastodon: z.string().optional(),
          github: z.string().optional(),
          facebook: z.string().optional(),
          youtube: z.string().optional(),
          linkedin: z.string().optional(),
          threads: z.string().optional(),
          instagram: z.string().optional(),
          medium: z.string().optional(),
        }),
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
