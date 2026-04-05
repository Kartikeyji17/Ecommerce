import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

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
    '/seller',           // ← add this
    '/seller/:path*',    // ← and this (for future nested pages)
  ],
}