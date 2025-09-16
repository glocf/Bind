
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is signed in and the current path is /login or /signup, redirect to /account
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  // if user is not signed in and the current path is not /
  if (!user && request.nextUrl.pathname.startsWith('/account')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/account/:path*',
  ],
}
