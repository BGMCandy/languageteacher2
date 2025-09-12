import { createClientBrowser } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { chars } = await request.json()

    if (!chars || !Array.isArray(chars) || chars.length === 0) {
      return NextResponse.json({ error: 'Characters array is required' }, { status: 400 })
    }

    if (chars.length > 20) {
      return NextResponse.json({ error: 'Maximum 20 characters per batch' }, { status: 400 })
    }

    const supabase = createClientBrowser()

    const { data, error } = await supabase
      .from('hanzi_characters')
      .select('*')
      .in('char', chars)

    if (error) {
      console.error('Error fetching batch hanzi details:', error)
      return NextResponse.json({ error: 'Failed to fetch character details' }, { status: 500 })
    }

    // Create a map for easy lookup
    const detailsMap = data?.reduce((acc, item) => {
      acc[item.char] = item
      return acc
    }, {} as Record<string, any>) || {}

    // Set cache headers for performance
    const response = NextResponse.json(detailsMap)
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    
    return response

  } catch (error) {
    console.error('Batch detail API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
