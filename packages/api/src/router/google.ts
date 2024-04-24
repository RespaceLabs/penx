import { google } from 'googleapis'
import { z } from 'zod'
import { GoogleInfo } from '@penx/model'
import { GoogleDriveConnectedData } from '@penx/types'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!

export const googleRouter = createTRPCRouter({
  googleDriveToken: publicProcedure

    .input(z.boolean().optional())
    .query(async ({ ctx, input: shouldRefresh }) => {
      const userId = ctx.token.uid

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } })

      if (!user?.google) return null

      const googleInfo = user.google as GoogleInfo

      const isExpired = googleInfo.expiry_date < Date.now()

      console.log('=========isExpired:', isExpired)

      if (isExpired || shouldRefresh) {
        if (!googleInfo.refresh_token) return null

        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)

        oauth2Client.setCredentials({
          refresh_token: googleInfo.refresh_token,
        })

        const accessToken = await oauth2Client.getAccessToken()

        const oauth2 = google.oauth2({
          auth: oauth2Client,
          version: 'v2',
        })

        const userInfo = await oauth2.userinfo.get()

        if (accessToken.token && accessToken.res?.data) {
          const newData = {
            ...accessToken.res?.data,
            ...userInfo.data,
          } as GoogleDriveConnectedData

          await ctx.prisma.user.update({
            where: { id: userId },
            data: { google: newData },
          })

          return newData
        }

        return null
      }

      return googleInfo
    }),

  disconnectGoogleDrive: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.prisma.user.update({
      where: { id: ctx.token.uid },
      data: { google: {} },
    })
    return true
  }),
})
