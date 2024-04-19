import Redis from 'ioredis'
import ky from 'ky'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

interface TagTemplate {
  metadata: {
    name: string
    color: string
    description: string
  }
  columns: Array<{
    displayName: string
    fieldName: string
    description: string
    fieldType: string
  }>
  rows: Array<Record<string, any>>
}

export const tagTemplateRouter = createTRPCRouter({
  tagTemplates: publicProcedure.query(async ({ ctx, input }) => {
    try {
      const files = (await ky
        .get(
          'https://api.github.com/repos/penxio/tag-templates/contents/templates',
        )
        .json()) as any[]

      const promises = files.map((file) => {
        return ky.get(file.download_url).json()
      })

      const results = await Promise.all(promises)

      return results as TagTemplate[]
    } catch (error) {
      return []
    }
  }),

  tagTemplateByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const name = input.name

        const str = await redis.get(name)

        if (str) {
          console.log('cache hit........')
          return JSON.parse(str) as TagTemplate
        }

        const tpl = await ky
          .get(
            `https://raw.githubusercontent.com/penxio/tag-templates/main/templates/${name}.json`,
          )
          .json()

        await redis.set(name, JSON.stringify(tpl))
        return tpl as TagTemplate
      } catch (error) {
        return null
      }
    }),
})
