import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl

  const path = url.pathname

  const session = await getToken({ req })

  if (session && ['/login'].includes(path)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const shouldLogin = path.startsWith('/') || path.startsWith('/dashboard')

  if (shouldLogin && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/dashboard', '/s/(.*)'],
}
