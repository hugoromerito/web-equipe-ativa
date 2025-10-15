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
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/sign-in'
      redirectUrl.search = `?error=${error}`
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

    ;(await cookies()).set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    const redirectUrl = request.nextUrl.clone()

    redirectUrl.pathname = '/'
    redirectUrl.search = ''

    console.log('✅ Redirecionando para home...')

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('❌ Erro no callback do Google:', error)
    
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/sign-in'
    redirectUrl.search = '?error=auth_failed'
    
    return NextResponse.redirect(redirectUrl)
  }
}
