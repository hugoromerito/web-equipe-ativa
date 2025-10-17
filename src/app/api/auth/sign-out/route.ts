import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Create a proper redirect URL without duplicating port
  const redirectUrl = new URL('/auth/sign-in', request.nextUrl.origin)
  
  ;(await cookies()).delete('token')

  return NextResponse.redirect(redirectUrl)
}
