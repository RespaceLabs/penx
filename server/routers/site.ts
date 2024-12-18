import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '../db'
import { sites } from '../db/schema'
import { getSite } from '../lib/getSite'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const siteRouter = router({
  getSite: publicProcedure.query(async () => {
    const site = await getSite()
    return site
  }),

  updateSite: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        logo: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        about: z.string().optional(),
        themeName: z.string().optional(),
        spaceId: z.string().optional(),
        socials: z
          .object({
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
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const site = await db.query.sites.findFirst({
        where: eq(sites.id, id),
      })
      const revalidate = () => {
        revalidatePath('/', 'layout')
        revalidatePath('/', 'page')
        revalidatePath('/about/page', 'page')
        revalidatePath('/~', 'layout')
      }
      if (!site) {
        const newSite = await db
          .insert(sites)
          .values({
            ...data,
            socials: JSON.stringify({}),
            config: JSON.stringify({}),
            name: data.name || '',
          } as any)
          .returning()

        revalidate()
        return newSite
      } else {
        const newSite = await db
          .update(sites)
          .set({
            ...data,
            socials: JSON.stringify(data.socials || {}),
          })
          .where(eq(sites.id, id))
        revalidate()
        return newSite
      }
    }),
})
