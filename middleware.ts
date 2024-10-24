import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  const searchParams = req.nextUrl.searchParams.toString()
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`

  if (path.startsWith('/~')) {
    const token = await getToken({ req })

    if (!token) {
      return NextResponse.redirect(new URL('/', req.url))
    } else {
      return NextResponse.next()
    }
  }

  // if (path.startsWith('/~') ) {
  //   const token = await getToken({ req })
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/login', req.url))
  //   }
  //   return NextResponse.rewrite(new URL(path, req.url))
  // }

  return NextResponse.next()
}
