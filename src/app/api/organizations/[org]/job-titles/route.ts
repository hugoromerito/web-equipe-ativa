import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { org: string } }
) {
  try {
    const { org } = params
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Token not found', message: 'Não autenticado' },
        { status: 401 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const url = `${apiUrl}/organizations/${org}/job-titles`

    console.log('🔐 [API ROUTE] Proxying job-titles request:', url)

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Erro desconhecido' }))
      console.error('❌ [API ROUTE] Job-titles fetch error:', errorData)
      return NextResponse.json(
        { error: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ [API ROUTE] Job-titles fetched successfully')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [API ROUTE] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    )
  }
}
