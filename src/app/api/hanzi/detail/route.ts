import { createClientBrowser } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const char = searchParams.get('char')

    if (!char) {
      return NextResponse.json({ error: 'Character parameter is required' }, { status: 400 })
    }

    const supabase = createClientBrowser()

    const { data, error } = await supabase
      .from('hanzi_characters')
      .select('*')
      .eq('char', char)
      .single()

    if (error) {
      console.error('Error fetching hanzi detail:', error)
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    // Set cache headers for performance
    const response = NextResponse.json(data)
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    
    return response

  } catch (error) {
    console.error('Detail API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
