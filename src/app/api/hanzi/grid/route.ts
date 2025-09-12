import { createClientBrowser } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = parseInt(searchParams.get('limit') || '2400')
    const view = searchParams.get('view') || 'definition'

    const supabase = createClientBrowser()

    // Build the query - show all characters for now
    const query = supabase
      .from('hanzi_characters')
      .select('char, kdefinition, kmandarin')
      .order('char')
      .range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching hanzi grid:', error)
      return NextResponse.json({ error: 'Failed to fetch hanzi data' }, { status: 500 })
    }

    // Transform data to include precomputed flags
    const items = data?.map(item => ({
      char: item.char,
      has_definition: !!item.kdefinition,
      has_pinyin: !!(item.kmandarin && item.kmandarin.length > 0)
    })) || []

    // Get total count for pagination
    const { count } = await supabase
      .from('hanzi_characters')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      items,
      total: count || 0,
      offset,
      limit,
      hasMore: (offset + limit) < (count || 0)
    })

  } catch (error) {
    console.error('Grid API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
