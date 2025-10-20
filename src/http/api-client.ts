import ky from 'ky'
import { getCookie } from 'cookies-next'
import { env } from '@/config/env'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  timeout: 60000, // 60 segundos (aumentado)
  retry: {
    limit: 3, // Aumentado para 3 tentativas
    methods: ['get', 'post', 'put', 'delete'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
    // Adiciona delay entre retries
    delay: (attemptCount) => 0.3 * (2 ** (attemptCount - 1)) * 1000,
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
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
          // Código do cliente (browser)
          token = getCookie('token') as string | undefined
          
          // Fallback: tentar pegar do document.cookie diretamente
          if (!token) {
            const cookieValue = document.cookie
              .split('; ')
              .find(row => row.startsWith('token='))
              ?.split('=')[1];
            
            token = cookieValue;
          }
        }

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        } else {
          console.warn('⚠️ No auth token found!', {
            environment: typeof window === 'undefined' ? 'server' : 'client',
            url: request.url,
            cookies: typeof window !== 'undefined' ? document.cookie : 'server-side'
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
          message: error.message,
          cause: error.cause
        })

        // Log específico para erros de auth
        if (error.response?.status === 401) {
          console.error('🔒 Authentication failed! Token may be missing or expired.')
        }

        // Log específico para erros de conexão
        if (error.message?.includes('fetch failed') || error.cause) {
          console.error('🔌 Connection error - API may be down or unreachable')
        }

        return error
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        // Log de sucesso para debug
        if (response.ok) {
          console.log('✅ API Success:', {
            url: request.url,
            status: response.status,
            method: request.method
          })
        }
        return response
      }
    ]
  },
})