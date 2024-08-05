import { Holder } from '@prisma/client'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const holderRouter = router({
  listByPostId: publicProcedure.input(z.string()).query(async ({ input }) => {
    return {} as (Holder & {
      user: {
        name: string | null
        ensName: string | null
        email: string | null
        address: string
      }
    })[]
  }),
})
