import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@penx/db'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN as string

export async function middleware(req: NextRequest) {
  const url = req.nextUrl

  if (/^\/(api|_next\/|favicon\.ico)/.test(url.pathname)) {
    return NextResponse.next()
  }

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:5001)
  const hostname = req.headers
    .get('host')!
    .replace('.localhost:5001', `.${ROOT_DOMAIN}`)

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname

  const session = await getToken({ req })

  const isSubdomain =
    hostname.replace(ROOT_DOMAIN, '').length > 0 &&
    hostname.replace(ROOT_DOMAIN, '') !== 'www.'

  // if (isSubdomain) {
  //   return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url))
  // }

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

  // rewrite everything else to `/[domain]/[path] dynamic route
  // return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url))
}
