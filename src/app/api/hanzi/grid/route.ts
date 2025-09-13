import { createClientBrowser } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = parseInt(searchParams.get('limit') || '2400')
    const grade = searchParams.get('grade') // New parameter for grade-specific loading

    const supabase = createClientBrowser()

    // Build the query - sort by kGradeLevel from properties JSON
    let query = supabase
      .from('hanzi_characters')
      .select('char, kdefinition, kmandarin, properties')

    // If grade is specified, filter by that grade
    if (grade) {
      query = query.eq('properties->>kGradeLevel', grade)
    }

    // Apply ordering and pagination
    query = query
      .order('properties->kGradeLevel', { ascending: true, nullsFirst: false })
      .range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching hanzi grid:', error)
      return NextResponse.json({ error: 'Failed to fetch hanzi data' }, { status: 500 })
    }

    // Transform data to include precomputed flags and grade level
    const items = data?.map(item => {
      const properties = item.properties as Record<string, unknown>;
      const gradeLevel = properties?.kGradeLevel ? parseInt(String(properties.kGradeLevel)) : null;
      
      return {
        char: item.char,
        has_definition: !!item.kdefinition,
        has_pinyin: !!(item.kmandarin && item.kmandarin.length > 0),
        grade_level: gradeLevel
      };
    }) || []

    // Get total count for pagination
    let countQuery = supabase
      .from('hanzi_characters')
      .select('*', { count: 'exact', head: true })
    
    if (grade) {
      countQuery = countQuery.eq('properties->>kGradeLevel', grade)
    }
    
    const { count } = await countQuery

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
