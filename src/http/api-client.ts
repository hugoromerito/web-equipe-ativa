import ky from 'ky'
import { getCookie } from 'cookies-next'
import { env } from '@/config/env'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined

        if (typeof window === 'undefined') {
          // Código do servidor (SSR)
          const { cookies } = await import('next/headers')
          const serverCookies = cookies()
          token = (await serverCookies).get('token')?.value
        } else {
          // Código do cliente (browser) - ESSA PARTE ESTAVA FALTANDO!
          token = getCookie('token') as string | undefined
        }

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        } else {
          console.warn('⚠️ No auth token found!', {
            environment: typeof window === 'undefined' ? 'server' : 'client',
            url: request.url
          })
        }
      },
    ],
    beforeError: [
      (error) => {
        console.error('❌ API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.request?.url,
          message: error.message
        })

        // Log específico para erros de auth
        if (error.response?.status === 401) {
          console.error('🔒 Authentication failed! Token may be missing or expired.')
        }

        return error
      }
    ]
  },
})