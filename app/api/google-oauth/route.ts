import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const userId = url.searchParams.get('state')
  const redirectUri = `${url.protocol}//${url.host}/api/google-oauth`

  if (!code || !userId) {
    return NextResponse.redirect('/error') // Handle error accordingly
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

  const { tokens } = await auth.getToken(code)

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oauth2Client.setCredentials(tokens)

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  })

  const userInfo = await oauth2.userinfo.get()

  await prisma.user.update({
    where: { id: userId },
    data: {
      google: {
        ...tokens,
        ...userInfo.data,
      },
    },
  })

  return NextResponse.redirect(new URL('/~/backup', req.url))
}
