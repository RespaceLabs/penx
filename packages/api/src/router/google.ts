import { google } from 'googleapis'
import Redis from 'ioredis'
import { z } from 'zod'
import { RedisKeys } from '@penx/constants'
import { createTRPCRouter, publicProcedure } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!

type GoogleToken = {
  access_token: string
  scope: string
  token_type: string
  expiry_date: number
  refresh_token: string
}

export const googleRouter = createTRPCRouter({
  googleDriveToken: publicProcedure.query(async ({ ctx, input }) => {
    const key = RedisKeys.googleDriveToken(ctx.token.uid)

    const tokenStr = (await redis.get(key)) as string

    if (!tokenStr) return null

    const existingToken = JSON.parse(tokenStr) as GoogleToken

    const isExpired = existingToken.expiry_date < Date.now()

    if (isExpired) {
      if (!existingToken.refresh_token) {
        return null
      }

      const auth = new google.auth.OAuth2(clientId, clientSecret)

      auth.setCredentials({ refresh_token: existingToken.refresh_token })

      const accessToken = await auth.getAccessToken()

      if (accessToken.token && accessToken.res?.data) {
        await redis.set(key, JSON.stringify(accessToken.res?.data))
        return accessToken.res?.data as GoogleToken
      }

      return null
    }

    return existingToken
  }),
})
