import { signInWithGoogle } from '@/http/sign-in-with-google'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    // Se o usuário negou o acesso
    if (error) {
      console.error('❌ Erro no OAuth:', error)
      const redirectUrl = new URL(`/auth/sign-in?error=${error}`, request.nextUrl.origin)
      return NextResponse.redirect(redirectUrl)
    }

    if (!code) {
      console.error('❌ Código Google não encontrado')
      return NextResponse.json(
        { message: 'Código Google não foi encontrado.' },
        { status: 400 },
      )
    }

    console.log('✅ Código recebido do Google, autenticando...')

    // Tratamento para substituir '%2F' por '/'
    const codeTratado = code.replace(/%2F/gi, '/')

    const { token } = await signInWithGoogle({ code: codeTratado })

    console.log('✅ Token recebido, salvando cookie...')

    const isProduction = process.env.NODE_ENV === 'production'

    ;(await cookies()).set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false, // Permitir acesso via JavaScript no client-side
      secure: isProduction, // Apenas HTTPS em produção
      sameSite: 'lax', // Permite envio em navegações cross-site
    })

    console.log('✅ Redirecionando para home...')

    // Create a proper redirect URL without duplicating port
    const redirectUrl = new URL('/', request.nextUrl.origin)

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('❌ Erro no callback do Google:', error)
    
    // Create a proper redirect URL without duplicating port
    const redirectUrl = new URL('/auth/sign-in?error=auth_failed', request.nextUrl.origin)
    
    return NextResponse.redirect(redirectUrl)
  }
}
