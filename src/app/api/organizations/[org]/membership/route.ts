import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET(
  request: Request,
  { params }: { params: Promise<{ org: string }> }
) {
  try {
    const { org } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Token not found' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_URL}/organizations/${org}/membership`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching membership:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
