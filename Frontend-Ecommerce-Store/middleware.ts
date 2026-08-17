import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('MIDDLEWARE DEBUG:', {
    path: req.nextUrl.pathname,
    hasToken: !!token,
    secretExists: !!process.env.NEXTAUTH_SECRET,
    cookieHeader: req.headers.get('cookie'),
  })

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/cart',
    '/orders/:path*',
    '/profile/:path*',
    '/checkout/:path*',
    '/seller',
    '/seller/:path*',
  ],
}