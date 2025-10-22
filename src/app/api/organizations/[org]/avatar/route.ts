import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(
  request: NextRequest,
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

    // Get the form data from the request
    const formData = await request.formData()

    // Forward to external API
    const response = await fetch(`${API_URL}/organizations/${org}/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error uploading organization avatar:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
