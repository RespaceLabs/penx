import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl

  if (/^\/(api|_next\/|favicon\.ico)/.test(url.pathname)) {
    return NextResponse.next()
  }

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname

  const session = await getToken({ req })

  if (session && ['/', '/login'].includes(path)) {
    return NextResponse.redirect(new URL('/editor', req.url))
  }

  if (path.startsWith('/editor') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}
