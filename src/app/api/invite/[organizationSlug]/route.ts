import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationSlug: string }> }
) {
  try {
    const { organizationSlug } = await params
    const body = await request.json()
    const token = (await cookies()).get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação não encontrado' },
        { status: 401 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${apiUrl}/organizations/${organizationSlug}/invites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro no proxy de convites:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}