import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ inviteId: string }> }
) {
  try {
    const { inviteId } = await params
    const token = (await cookies()).get('token')?.value
    if (!token) return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 })

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const resp = await fetch(`${apiUrl}/invites/${inviteId}/reject`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Removido Content-Type pois não há body
      },
    })

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ message: 'Erro desconhecido' }))
      return NextResponse.json(err, { status: resp.status })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao rejeitar convite (proxy no /reject):', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
