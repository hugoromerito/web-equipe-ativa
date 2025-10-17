import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationSlug: string }> }
) {
  try {
    const { organizationSlug } = await params
    const token = (await cookies()).get('token')?.value
    if (!token) return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 })

    // Extrai parâmetros de query da URL
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const pageSize = url.searchParams.get('pageSize')
    
    // Constrói a URL do backend com os parâmetros
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const backendUrl = new URL(`${apiUrl}/organizations/${organizationSlug}/invites`)
    if (page) backendUrl.searchParams.set('page', page)
    if (pageSize) backendUrl.searchParams.set('pageSize', pageSize)
    
    const resp = await fetch(backendUrl.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ message: 'Erro desconhecido' }))
      return NextResponse.json(err, { status: resp.status })
    }

    const data = await resp.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar convites da org (proxy):', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
