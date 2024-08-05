import { Member } from '@prisma/client'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const memberRouter = router({
  listBySpaceId: publicProcedure.input(z.string()).query(async ({ input }) => {
    return [] as (Member & {
      user: {
        name: string | null
        ensName: string | null
        email: string | null
        address: string
      }
    })[]
  }),
})
