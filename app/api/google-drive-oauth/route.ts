import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const access_token = url.searchParams.get('access_token')
  const refresh_token = url.searchParams.get('refresh_token')
  const expiry_date = url.searchParams.get('expiry_date')
  const address = url.searchParams.get('address')
  const name = url.searchParams.get('name')
  const picture = url.searchParams.get('picture')
  const email = url.searchParams.get('email')

  if (!access_token || !refresh_token || !expiry_date || !address) {
    return NextResponse.redirect('/error') // Handle error accordingly
  }

  const account = await prisma.account.findUniqueOrThrow({
    where: { providerAccountId: address },
  })
  await prisma.user.update({
    where: { id: account.userId },
    data: {
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

  return NextResponse.redirect(new URL('/~/backup', req.url))
}
