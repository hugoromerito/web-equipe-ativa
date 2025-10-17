import { getCookie } from 'cookies-next'

export function testAuth() {
  console.log('=== DEBUG DE AUTENTICAÇÃO ===')
  console.log('Environment:', typeof window === 'undefined' ? 'server' : 'client')
  
  if (typeof window !== 'undefined') {
    // No cliente
    console.log('Document cookies:', document.cookie)
    console.log('getCookie result:', getCookie('token'))
    
    // Testar método manual
    const manualToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1]
    
    console.log('Manual token:', manualToken)
  }
  
  console.log('============================')
}