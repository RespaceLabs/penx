import { prisma } from '@/lib/prisma'
import { ProviderType } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const access_token = url.searchParams.get('access_token')
  const refresh_token = url.searchParams.get('refresh_token')
  const expiry_date = url.searchParams.get('expiry_date')
  const userId = url.searchParams.get('uid')
  const name = url.searchParams.get('name')
  const openid = url.searchParams.get('openid')
  const picture = url.searchParams.get('picture')
  const email = url.searchParams.get('email')

  if (!access_token || !refresh_token || !expiry_date || !userId) {
    return NextResponse.redirect('/error') // Handle error accordingly
  }

  const account = await prisma.account.findFirst({
    where: { userId, providerType: ProviderType.GOOGLE },
  })

  if (!account) {
    await prisma.account.create({
      data: {
        userId,
        providerType: ProviderType.GOOGLE,
        providerAccountId: openid!,
        refreshToken: refresh_token,
        accessToken: access_token,
        expiresAt: new Date(expiry_date).valueOf(),
        providerInfo: {
          name,
          picture,
          email,
        },
      },
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        google: {
          name,
          email,
          picture,
          access_token,
          refresh_token,
          expiry_date,
        },
      },
    })
  }

  return NextResponse.redirect(new URL('/~/settings/link-accounts', req.url))
}
