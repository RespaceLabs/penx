import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'
import Redis from 'ioredis'
import { NextApiRequest, NextApiResponse } from 'next'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
const redirectUri = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/google-oauth`
// const redirectUri = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`

console.log('>>>>>========redirectUri:', redirectUri)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const code = req.query.code as string
  const userId = req.query.state as string
  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

  console.log('=======code:', code)

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

  // const redisKey = RedisKeys.user(userId)
  // await redis.del(redisKey)

  res.redirect(`/~/backup`)
}
