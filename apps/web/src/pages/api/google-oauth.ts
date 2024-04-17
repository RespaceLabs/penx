import { google } from 'googleapis'
import Redis from 'ioredis'
import { NextApiRequest, NextApiResponse } from 'next'
import { RedisKeys } from '@penx/constants'
import { prisma } from '@penx/db'

const redis = new Redis(process.env.REDIS_URL!)

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!
const redirectUri = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/google-oauth`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const code = req.query.code as string
  const [userId, from] = (req.query.state as string).split('__')

  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

  const { tokens } = await auth.getToken(code)

  console.log('==========tokens:', tokens)

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oauth2Client.setCredentials(tokens)

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  })

  const userInfo = await oauth2.userinfo.get()

  console.log('User Profile:', userInfo.data)

  await prisma.user.update({
    where: { id: userId },
    data: {
      google: {
        ...tokens,
        ...userInfo.data,
      },
    },
  })

  const redisKey = RedisKeys.user(userId)
  await redis.del(redisKey)

  res.redirect(`/?from=${from}`)
}
