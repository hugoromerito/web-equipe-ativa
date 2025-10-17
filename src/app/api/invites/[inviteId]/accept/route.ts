import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ inviteId: string }> }
) {
  try {
    const { inviteId } = await params
    const token = (await cookies()).get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação não encontrado' },
        { status: 401 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${apiUrl}/invites/${inviteId}/accept`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      return NextResponse.json(errorData, { status: response.status })
    }

    // A API retorna 204 (No Content) para sucesso
    if (response.status === 204) {
      return NextResponse.json({ success: true })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao aceitar convite:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}