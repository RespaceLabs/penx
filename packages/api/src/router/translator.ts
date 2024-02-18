import { z } from 'zod'
import { translate } from '@penx/google-translate'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const translatorRouter = createTRPCRouter({
  googleTranslate: publicProcedure
    .input(
      z.object({
        from: z.string(),
        to: z.string(),
        text: z.string(),
        raw: z.boolean().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const { text, ...rest } = input
      return translate(text, rest)
    }),
})
