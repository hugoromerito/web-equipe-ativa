import ky from 'ky'
import { getCookie } from 'cookies-next'
import { env } from '@/config/env'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  timeout: 60000, // 60 segundos (aumentado)
  credentials: 'include', // Envia cookies automaticamente em requisições cross-origin
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
          
          // Fallback - tentar pegar do document.cookie diretamente
          if (!token) {
            const cookieValue = document.cookie
              .split('; ')
              .find(row => row.startsWith('token='))
              ?.split('=')[1]
            
            token = cookieValue
          }

          // Fallback adicional - verificar localStorage
          if (!token && typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token') || undefined
          }
        }

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    beforeError: [
      (error) => {
        // Log apenas em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error:', error.response?.status, error.message)
        }
        return error
      }
    ],
  },
})