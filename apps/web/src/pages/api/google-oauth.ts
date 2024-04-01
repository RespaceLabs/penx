import { google } from 'googleapis'
import Redis from 'ioredis'
import { NextApiRequest, NextApiResponse } from 'next'
import { RedisKeys } from '@penx/constants'

type GoogleToken = {
  access_token: string
  scope: string
  token_type: string
  expiry_date: number
  refresh_token: string
}

const redis = new Redis(process.env.REDIS_URL!)

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!
const redirectUri = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/google-oauth`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const code = req.query.code as string
  const state = req.query.state as string

  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

  const { tokens } = await auth.getToken(code)

  // console.log('==========tokens:', tokens)

  const key = RedisKeys.googleDriveToken(state)

  const existingToken = (await redis.get(key)) as any as GoogleToken

  if (!existingToken?.access_token) {
    await redis.set(key, JSON.stringify(tokens))
  }

  // auth.setCredentials(tokenRes.tokens)

  // const drive = google.drive({ version: 'v3', auth })

  // try {
  //   const res = await drive.files.create({
  //     requestBody: {
  //       name: `hello_${Date.now()}`,
  //       mimeType: 'text/plain',
  //     },
  //     media: {
  //       mimeType: 'text/plain',
  //       body: 'Hello World',
  //     },
  //   })

  //   console.log('File uploaded successfully. File ID:', res)
  // } catch (error) {
  //   console.error('Error uploading file:', error)
  // }

  res.redirect(`/`)
}
