import { signInWithGoogle } from '@/http/sign-in-with-google'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'Código Google não foi encontrado.' },
      { status: 400 },
    )
  }

  // Tratamento para substituir '%2F' por '/'
  const codeTratado = code.replace(/%2F/gi, '/')

  const { token } = await signInWithGoogle({ code: codeTratado })

  const isProduction = process.env.NODE_ENV === 'production'

  ;(await cookies()).set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false, // Permitir acesso via JavaScript no client-side
    secure: isProduction, // Apenas HTTPS em produção
    sameSite: 'lax', // Permite envio em navegações cross-site
  })

  // Create a proper redirect URL without duplicating port
  const redirectUrl = new URL('/', request.nextUrl.origin)

  return NextResponse.redirect(redirectUrl)
}
