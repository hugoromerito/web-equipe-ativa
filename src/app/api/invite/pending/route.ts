import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const token = (await cookies()).get('token')?.value
    if (!token) return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 })

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const resp = await fetch(`${apiUrl}/invites/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ message: 'Erro desconhecido' }))
      return NextResponse.json(err, { status: resp.status })
    }

    const data = await resp.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar convites pendentes (proxy):', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
