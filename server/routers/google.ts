import { prisma } from '@/lib/prisma'
import { GoogleInfo } from '@/lib/types'
import { google } from 'googleapis'
import Redis from 'ioredis'
import { protectedProcedure, publicProcedure, router } from '../trpc'

// const redis = new Redis(process.env.REDIS_URL!)

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!

export const googleRouter = router({
  googleDriveToken: publicProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.token.uid

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user?.google) return null

    const googleInfo = user.google as GoogleInfo

    const isExpired = googleInfo.expiry_date < Date.now()

    // console.log(
    //   '=========isExpired:',
    //   isExpired,
    //   'googleInfo.expiry_date:',
    //   googleInfo.expiry_date,
    //   'googleInfo:',
    //   googleInfo,
    // )

    if (!isExpired) {
      return googleInfo
    }

    if (!googleInfo.refresh_token) return null

    try {
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)

      oauth2Client.setCredentials({
        refresh_token: googleInfo.refresh_token,
      })

      const accessToken = await oauth2Client.getAccessToken()

      // console.log('======accessToken:', accessToken)

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
      })

      const userInfo = await oauth2.userinfo.get()

      if (accessToken.token && accessToken.res?.data) {
        const newData = {
          ...accessToken.res?.data,
          ...userInfo.data,
        } as GoogleInfo

        await prisma.user.update({
          where: { id: userId },
          data: { google: newData },
        })

        return newData
      }

      return null
    } catch (error) {
      console.log('error=============:', error)
      return null
    }
  }),

  disconnectGoogleDrive: protectedProcedure.mutation(async ({ ctx }) => {
    return prisma.user.update({
      where: { id: ctx.token.uid },
      data: { google: {} },
    })
    return true
  }),
})
