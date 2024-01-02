import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl

  if (/^\/(api|_next\/|favicon\.ico)/.test(url.pathname)) {
    return NextResponse.next()
  }

  const session = await getToken({ req })

  // if (session && path === '/login') {
  //   return NextResponse.redirect(new URL('/', req.url))
  // }

  // if (
  //   (path.startsWith('/spaces') || path.startsWith('/new-space')) &&
  //   !session
  // ) {
  //   return NextResponse.redirect(new URL('/login', req.url))
  // }

  return NextResponse.next()
}
