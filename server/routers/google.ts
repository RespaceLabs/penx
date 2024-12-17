import { REFRESH_GOOGLE_DRIVE_OAUTH_TOKEN_URL } from '@/lib/constants'
import { GoogleInfo } from '@/lib/types'
import { eq } from 'drizzle-orm'
import ky from 'ky'
import { db } from '../db'
import { users } from '../db/schema'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const googleRouter = router({
  googleDriveToken: publicProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.token.uid

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user?.google) return null

    const googleInfo = JSON.parse(user.google) as GoogleInfo

    const isExpired = googleInfo.expiry_date < Date.now()

    console.log('=========isExpired:', isExpired)

    if (!isExpired) {
      return googleInfo
    }

    if (!googleInfo.refresh_token) return null

    try {
      const tokenInfo = await ky
        .get(
          REFRESH_GOOGLE_DRIVE_OAUTH_TOKEN_URL +
            `?refresh_token=${googleInfo.refresh_token}`,
        )
        .json<any>()

      await db
        .update(users)
        .set({
          google: JSON.stringify(tokenInfo),
        })
        .where(eq(users.id, userId))
      return tokenInfo
    } catch (error) {
      console.log('error=============:', error)
      return null
    }
  }),

  disconnectGoogleDrive: protectedProcedure.mutation(async ({ ctx }) => {
    return db
      .update(users)
      .set({
        google: JSON.stringify({}),
      })
      .where(eq(users.id, ctx.token.uid))
  }),
})
